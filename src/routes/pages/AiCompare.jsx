import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { _axiosAuth } from '@/api/instance';
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
  } catch (error) {
    // 이미지 불러오기 중 발생하는 오류 로깅 및 전파
    console.error('이미지를 불러오는 중 오류 발생:', error);
    throw error;
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

export const AiCompare = () => {
  // React Router의 location 훅을 사용해 이전 페이지에서 전달된 이미지 데이터 추출
  const location = useLocation();
  const imageData = location.state?.ImageData;

  // React Query를 사용하여 강사 이미지 불러오기
  // 쿼리 키: ['InstructorImg']로 캐싱 및 식별
  const { data: InstructorBlob, isLoading } = useQuery({
    queryKey: ['InstructorImg'],
    queryFn: async () => {
      // 특정 ID(4)를 사용하여 이미지 URL 요청
      const { data } = await _axiosAuth.get(`/image-similarity/${4}`);

      // 응답 데이터 유효성 검사
      if (data.body?.code !== 200) {
        throw new Error(data.body.message || '데이터를 찾을 수 없습니다.');
      }

      // 받아온 이미지 URL을 Blob으로 변환
      const imageUrl = data.body.data.completedImageUrl;
      return fetchImageAsBlob(imageUrl);
    },
    // 오류 발생 시 콘솔에 로깅
    onError: (error) => {
      console.error('이미지 로딩 실패:', error);
    },
  });

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
        'https://www.grimtalk.com/fastapi/analysis/compare_images',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      return response.data.data;
    },
    // 성공 시 분석 결과 로깅
    onSuccess: (data) => {
      console.log('분석 완료:', data);
      setAnalysisResult(data);
    },
    // 실패 시 오류 로깅
    onError: (error) => {
      console.error('분석 실패:', error);
    },
  });

  // 분석 시작 버튼 핸들러
  const handleAnalysis = () => {
    // 이미지 데이터 존재 여부 확인
    if (!imageData || !InstructorBlob) {
      console.error('이미지가 모두 준비되지 않았습니다.');
      return;
    }
    // AI 분석 뮤테이션 실행
    addAIanalysisMutation.mutate();
  };

  // 이미지 로딩 중 로딩 컴포넌트 표시
  if (isLoading) {
    return <LoadingComponents />;
  }

  return (
    <div>
      {/* 학생 이미지 표시 */}
      <div>
        <h1>내꺼</h1>
        <div>{imageData && <img src={imageData} alt="myDrawing" />}</div>
      </div>

      {/* 강사 이미지 표시 */}
      <div>
        <h1>강사</h1>
        <div>
          {InstructorBlob && <img src={URL.createObjectURL(InstructorBlob)} alt="instructorImg" />}
        </div>
      </div>

      {/* 분석 시작 버튼 */}
      <button
        onClick={handleAnalysis}
        // 이미지 준비 여부와 현재 분석 진행 상태에 따라 버튼 비활성화
        disabled={!imageData || !InstructorBlob || addAIanalysisMutation.isPending}
      >
        {/* 분석 진행 중일 때는 로딩 컴포넌트 표시 */}
        {addAIanalysisMutation.isPending ? <LoadingComponents /> : '분석 시작'}
      </button>
      {analysisResult && (
        <div>
          <h1 className="text-[40px]">{analysisResult.accuracy}</h1>
        </div>
      )}
    </div>
  );
};
