import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';

import { _axiosAuth } from '@/api/instance';
import { LoadingComponents } from '@/components/common/LoadingComponents';

export const AiCompare = () => {
  // state로 전달받기 -> 이미지
  const location = useLocation();
  const imageData = location.state?.ImageData;

  // api기능 - 강사 이미지
  const {
    data: InstructorImg,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: 'InstructorImg',
    queryFn: async () => {
      const { data } = await _axiosAuth.get(`/image-similarity/${4}`);
      // 에러 처리 코드
      if (data.body?.code !== 200) {
        throw new Error(data.body.message || '데이터를 찾을수 없습니다.');
      }
      return data.body.data.completedImageUrl;
    },
    onError: (error) => {
      // 구체적인 에러 처리
      console.error('이미지 로딩 실패:', error);
    },
  });

  // ai 분석 요청 api
  const addAIanalysisMutation = useMutation({
    mutationFn: async () => {
      // base64를 File 객체로 변환
      const base64ToFile = (base64String, filename) => {
        const arr = base64String.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
      };

      // student_file 변환 (base64 -> File)
      const studentFile = base64ToFile(imageData, 'student.png');

      // FormData 생성 및 파일 추가
      const formData = new FormData();
      formData.append('student_file', studentFile);
      formData.append('teacher_file', InstructorImg); // 강사 이미지 URL

      const { data } = await _axiosAuth.post('/fastapi/analysis/compare_images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return data;
    },
    onSuccess: (data) => {
      console.log('분석 완료:', data);
    },
    onError: (error) => {
      console.error('분석 실패:', error);
    },
  });

  // 분석 시작 버튼 핸들러
  const handleAnalysis = () => {
    if (!imageData || !InstructorImg) {
      console.error('이미지가 모두 준비되지 않았습니다.');
      return;
    }
    addAIanalysisMutation.mutate();
  };

  if (isLoading) {
    return <LoadingComponents />;
  }

  return (
    <>
      <div>
        <h1>내꺼</h1>
        <div>{imageData && <img src={imageData} alt="myDrawing" />}</div>
      </div>
      <div>
        <h1>강사</h1>
        <div>{InstructorImg && <img src={InstructorImg} alt="instructorImg" />}</div>
      </div>
      <button
        onClick={handleAnalysis}
        disabled={!imageData || !InstructorImg || addAIanalysisMutation.isPending}
      >
        {addAIanalysisMutation.isPending ? <LoadingComponents /> : '분석 시작'}
      </button>
    </>
  );
};
