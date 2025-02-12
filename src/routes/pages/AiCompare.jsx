import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';

import { _axiosAuth } from '@/api/instance';
import { LoadingComponents } from '@/components/common/LoadingComponents';

export const AiCompare = () => {
  // state로 전달받기 -> 이미지
  const location = useLocation();
  const imageData = location.state?.ImageData;

  // api기능
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
    </>
  );
};
