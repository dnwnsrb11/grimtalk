import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { _axiosAuth } from '@/api/instance';
import { AiCompareComponent } from '@/components/ai/AiCompareComponent';
import { InstructorIcon, StudentIcon } from '@/components/common/icons';
import { LoadingComponents } from '@/components/common/LoadingComponents';

// 이미지 URL을 Blob으로 변환하는 유틸리티 함수
// API 요청을 위해 이미지를 표준화된 형식으로 변환하는 역할
const fetchImageAsBlob = async (imageUrl) => {
  try {
    // 주어진 URL에서 이미지 가져오기
    const response = await fetch(imageUrl);
    // 응답을 Blob(이진 대형 객체) 형식으로 변환
    const blob = await response.blob();

    return blob;
  } catch {
    return null;
  }
};

// Base64 인코딩된 이미지를 Blob으로 변환하는 유틸리티 함수
// 상태(state)를 통해 전달되는 이미지를 처리하는 데 중요한 함수
const base64ToBlob = (base64Data, mimeType) => {
  // Base64 데이터에서 실제 base64 인코딩된 부분 추출 (','이후의 문자열)
  const byteCharacters = atob(base64Data.split(',')[1]);

  // Blob으로 변환하기 위해 바이트 배열 생성
  const byteArrays = [];

  // 대용량 Base64 데이터를 처리하기 위해 청크 단위로 변환
  for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
    // 1024바이트 단위로 데이터 자르기
    const slice = byteCharacters.slice(offset, offset + 1024);

    // 각 바이트를 숫자로 변환
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    // Uint8Array로 변환하여 byteArrays에 추가
    byteArrays.push(new Uint8Array(byteNumbers));
  }

  // 최종적으로 Blob 객체 생성 (MIME 타입 지정)
  return new Blob(byteArrays, { type: mimeType });
};

export const AiComparePage = () => {
  // React Router의 location 훅을 사용해 이전 페이지에서 전달된 이미지 데이터 추출
  const location = useLocation();
  const imageData = location.state?.ImageData;
  const curriculumId = location.state?.curriculumId;
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chartData, setChartData] = useState([]); // 차트 데이터를 저장할 상태 추가

  // React Query를 사용하여 강사 이미지 불러오기
  // 쿼리 키: ['InstructorImg']로 캐싱 및 식별
  const { data: InstructorBlob, isLoading } = useQuery({
    queryKey: ['InstructorBlob'],
    queryFn: async () => {
      const { data } = await _axiosAuth.get(
        `/curriculum/completed-image/${location.state?.curriculumId}`,
      );

      // 응답 데이터 유효성 검사
      if (data.body?.code !== 200) {
        throw new Error(data.body.message || '데이터를 찾을 수 없습니다.');
      }

      // 받아온 이미지 URL을 Blob으로 변환
      const imageUrl = data.body.data.imageUrl;

      return fetchImageAsBlob(imageUrl);
    },
  });

  // 이미 체크를 완료했는지 확인
  const [checkAiMutation, setCheckAiMutation] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  // AI 분석 요청을 보내는 Mutation 훅
  const addAIanalysisMutation = useMutation({
    mutationFn: async () => {
      // FormData 객체 생성 (multipart/form-data 형식의 요청을 위해)
      const formData = new FormData();

      // 학생 이미지(Base64)를 Blob으로 변환하여 추가
      if (imageData) {
        const studentImageBlob = base64ToBlob(imageData, 'image/png');
        formData.append('student_file', studentImageBlob);
      }

      // 강사 이미지(이미 Blob 형식)를 FormData에 추가
      if (InstructorBlob) {
        formData.append('teacher_file', InstructorBlob);
      }

      // FastAPI 엔드포인트로 이미지 비교 분석 요청
      const response = await _axiosAuth.post(
        'https://www.grimtalk.com/fastapi/analysis/compare-images',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 30000, // 30초로 증가
        },
      );

      return response.data.data;
    },
    // 성공 시 분석 결과 로깅
    onSuccess: (data) => {
      setAnalysisResult(data);
      setIsAnalyzing(false);
      setCheckAiMutation(true);
      // 분석 데이터가 있다면 차트 데이터로 변환
      if (data) {
        const analysis = data;
        const formattedData = [
          {
            taste: '색 유사도',
            myDrawing: analysis.color_similarity,
          },
          {
            taste: '선 유사도',
            myDrawing: analysis.line_thickness_similarity,
          },
          {
            taste: '모양 유사도',
            myDrawing: analysis.structure_similarity,
          },
        ];
        setChartData(formattedData); // 변환된 데이터를 상태에 저장
      }
    },
    // 실패 시 오류 로깅
    onError: (error) => {
      setIsAnalyzing(false);
    },
  });

  // 분석 시작 버튼 핸들러
  const handleAnalysis = () => {
    // 이미지 데이터 존재 여부 확인
    if (!imageData || !InstructorBlob) {
      return;
    }
    setIsAnalyzing(true);
    // AI 분석 뮤테이션 실행
    addAIanalysisMutation.mutate();
  };

  // 카운터 애니메이션 컴포넌트
  const CountUpAnimation = ({ targetNumber }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      // 애니메이션 시간 (2초)
      const duration = 2000;
      // 업데이트 간격 (60fps에 맞춰서)
      const interval = 1000 / 60;
      // 총 스텝 수
      const steps = duration / interval;
      // 각 스텝당 증가량
      const increment = targetNumber / steps;

      let currentNumber = 0;
      const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= targetNumber) {
          setCount(targetNumber);
          clearInterval(timer);
        } else {
          setCount(Math.floor(currentNumber));
        }
      }, interval);

      return () => clearInterval(timer);
    }, [targetNumber]);

    return <>{count}</>;
  };

  const [checkDataSave, setCheckDataSave] = useState(false);
  const addDataMuntation = useMutation({
    mutationFn: async () => {
      const { data } = await _axiosAuth.post(`/image-similarity`, {
        curriculumId: curriculumId,
        colorSimilarity: analysisResult.color_similarity,
        lineThicknessSimilarity: analysisResult.line_thickness_similarity,
        structureSimilarity: analysisResult.structure_similarity,
        colorComment: analysisResult.color_comment,
        lineComment: analysisResult.line_comment,
        structureComment: analysisResult.structure_comment,
        overallFeedback: analysisResult.overall_feedback,
      });
      setCheckDataSave(true);
      return data;
    },
  });

  // 이미지 로딩 중 로딩 컴포넌트 표시
  if (isLoading) {
    return <LoadingComponents />;
  }

  return (
    <>
      <div className="mt-[60px] flex flex-col">
        {/* 헤더 부분 */}
        <div className="rounded-2xl">
          <h1 className="text-[36px] font-bold text-black">
            그림 <span className="text-primary-color">유사도</span>를 확인해보세요!
          </h1>
          <p className="text-text-gray-color">
            수업 종료 후 저장된 이미지를 업로드하시면 여러분의 그림 진척도를 AI가 분석해드립니다.
          </p>
          <hr className="mt-[25px]" />
        </div>

        {/* 이미지 섹션 */}
        <div className="my-[60px] flex gap-4">
          <div className="flex-1 text-center">
            <div className="flex items-center justify-center gap-3">
              <StudentIcon fill="gray" />
              <h1 className="text-[24px] font-bold text-[#343434]">수강생</h1>
            </div>
            <div className="mt-[10px] flex h-full items-center justify-center rounded-2xl border p-4">
              <div>{imageData && <img src={imageData} alt="myDrawing" />}</div>
            </div>
          </div>

          <div className="flex-1 text-center">
            <div className="flex items-center justify-center gap-3">
              <InstructorIcon fill="gray" />
              <h1 className="text-[24px] font-bold text-[#343434]">강사</h1>
            </div>
            <div className="mt-[10px] flex h-full items-center justify-center rounded-2xl border p-4">
              {InstructorBlob && (
                <img src={URL.createObjectURL(InstructorBlob)} alt="instructorImg" />
              )}
            </div>
          </div>
        </div>

        {/* 버튼과 결과 섹션 */}
        <div className="mt-[20px] flex justify-between rounded-2xl border bg-bg-gray-color p-6 transition-all duration-200">
          <div>
            <p className="text-[18px] font-semibold">
              그려주신 그림을 강사그림과 비교하여 유사도를 통하여 그림 실력을 확인해보실수 있습니다.
            </p>
            <p className="text-[14px] font-normal text-text-gray-color">
              분석 시작 버튼을 클릭하면 분석이 시작됩니다.
            </p>
            {isAnalyzing && (
              <p className="mt-2 animate-pulse text-primary-color">
                AI가 그림을 분석하고 있습니다... 잠시만 기다려주세요.
              </p>
            )}
          </div>
          <div className="">
            <button
              className={`w-40 rounded-lg px-6 py-3 text-white transition-colors duration-300 disabled:bg-gray-300
                ${
                  isAnalyzing
                    ? 'animate-gradient relative overflow-hidden bg-gradient-to-r from-primary-color via-[#FF451C] to-primary-color bg-[length:200%_auto]'
                    : 'bg-primary-color hover:bg-[#FF451C]'
                }`}
              onClick={handleAnalysis}
              disabled={!imageData || !InstructorBlob || isAnalyzing}
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  분석중
                </div>
              ) : checkAiMutation ? (
                '분석 완료'
              ) : (
                '분석 시작'
              )}
            </button>
          </div>
        </div>
        {/* 분석 결과 섹션 */}
        {analysisResult && !isAnalyzing && (
          <div>
            <div className="flex gap-3">
              <div className="animate-fade-slide-down mt-[10px] flex flex-col items-center gap-4 rounded-2xl border p-6">
                <div className="flex w-[100%] flex-col items-center">
                  <div className="rounded-full border border-gray-400 px-[15px] py-[5px]">
                    <span className="text-[18px] font-light text-text-gray-color">색감 유사도</span>
                  </div>
                  <h1 className="text-[46px] font-bold text-primary-color">
                    <CountUpAnimation targetNumber={Number(analysisResult.color_similarity)} />%
                  </h1>
                </div>
                <div>
                  <p className="break-keep">{analysisResult.color_comment}</p>
                </div>
              </div>
              <div className="animate-fade-slide-down mt-[10px] flex flex-col items-center gap-4 rounded-2xl border p-6">
                <div className="flex w-[100%] flex-col items-center">
                  <div className="rounded-full border border-gray-400 px-[15px] py-[5px]">
                    <span className="text-[18px] font-light text-text-gray-color">선 유사도</span>
                  </div>
                  <h1 className="text-[46px] font-bold text-primary-color">
                    <CountUpAnimation
                      targetNumber={Number(analysisResult.line_thickness_similarity)}
                    />
                    %
                  </h1>
                </div>
                <div>
                  <p className="break-keep">{analysisResult.line_comment}</p>
                </div>
              </div>
              <div className="animate-fade-slide-down mt-[10px] flex flex-col items-center gap-4 rounded-2xl border p-6">
                <div className="flex w-[100%] flex-col items-center">
                  <div className="rounded-full border border-gray-400 px-[15px] py-[5px]">
                    <span className="text-[18px] font-light text-text-gray-color">구조 유사도</span>
                  </div>
                  <h1 className="text-[46px] font-bold text-primary-color">
                    <CountUpAnimation targetNumber={Number(analysisResult.structure_similarity)} />%
                  </h1>
                </div>
                <div>
                  <p className="break-keep">{analysisResult.color_comment}</p>
                </div>
              </div>
            </div>
            <div>
              <AiCompareComponent data={chartData} analysisResult={analysisResult} />
            </div>
            <div className="mt-[40px] border-t pt-[20px]">
              <div className="mt-[20px] flex items-center justify-between rounded-2xl border bg-bg-gray-color p-6 transition-all duration-200">
                <p className="text-[18px] font-semibold">
                  비교한 데이터는 저장하여 관리할 수 있습니다.
                </p>
                <button
                  className="mx-[15px] mt-[5px] rounded-xl border bg-[#FF5C38] px-[20px] py-[15px] text-white transition-colors duration-200 hover:bg-black"
                  onClick={() => addDataMuntation.mutate()}
                >
                  {checkDataSave ? <p>데이터 저장완료</p> : <p>데이터 저장하기</p>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          animation: gradient 2s linear infinite;
        }

        @keyframes fadeSlideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-slide-down {
          animation: fadeSlideDown 2s ease-out forwards;
        }
      `}</style>
    </>
  );
};
