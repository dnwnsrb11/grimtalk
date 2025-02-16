import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { _axiosAuth } from '@/api/instance';
import { LoadingComponents } from '@/components/common/LoadingComponents';

export const ReplayLectureDetail = ({ replayDate, setIsActive, checkInstructor }) => {
  const navigate = useNavigate();
  // api 호출
  const {
    data: replay,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['replay'],
    queryFn: async () => {
      const { data } = await _axiosAuth.get(`/replay/detail/${replayDate.replayId}`);
      return data.body.data;
    },
    onError: () => {
      navigate('/notfound');
    },
  });
  // 비디오 저장
  const [video, setVideo] = useState(null);
  const [drawingImg, setDrawingImg] = useState(null);
  const uploadVideo = (file) => {
    if (file) {
      setVideo(file);
    }
  };
  const uploadDrawingImg = (file) => {
    if (file) {
      setDrawingImg(file);
    }
  };

  // 비디오 업로드
  const addVideoMutaion = useMutation({
    mutationFn: async () => {
      if (video === null) {
        alert('파일을 먼저 업로드 해주세요.');
        return;
      }

      if (!replayDate?.curriculumId) {
        alert('커리큘럼 ID가 유효하지 않습니다.');
        return;
      }

      const formData = new FormData();
      formData.append('video', video);

      try {
        const { data } = await _axiosAuth.post(`/replay`, formData, {
          headers: {
            curriculumId: replay.curriculumId,
            'Content-Type': 'multipart/form-data',
          },
          // 큰 파일 업로드를 위한 타임아웃 설정
          timeout: 30000,
        });
        return data;
      } catch (error) {
        console.error('업로드 에러:', error);
        throw error;
      }
    },
    onSuccess: () => {
      alert('업로드 완료');
      setIsActive(false);
    },
    onError: (error) => {
      alert('업로드 실패: ' + error.message);
    },
  });

  if (isLoading) {
    return <LoadingComponents />;
  }
  return (
    <>
      <div className="mt-[60px]">
        <div className="min-h-[300px]">
          <h1 className="text-[32px] font-bold">{replay.subject}</h1>
          <p className="text-[18px] font-medium">{replay.content}</p>
        </div>
        <div className="mt-[10px] flex items-center justify-center">
          <button className="bg-primary-color rounded-2xl border px-[120px] py-[20px] text-center">
            <p className="text-[18px] font-semibold text-white">다시보기</p>
          </button>
        </div>
      </div>
      {checkInstructor && (
        <div className="mt-[50px]">
          <hr className="border-divider-color mt-[40px] border" />
          <div className="mt-[20px]">
            <h1 className="text-[32px] font-bold">다시보기 파일 업로드</h1>
            <div className="mt-[20px] flex justify-between gap-3">
              {video ? (
                <div className="bg-bg-gray-color flex w-[85%] items-center rounded-2xl border">
                  <p className="px-[20px] text-[18px] font-medium text-[#C6C6C6]">{video.name}</p>
                </div>
              ) : (
                <div className="bg-bg-gray-color flex w-[85%] items-center rounded-2xl border">
                  <p className="px-[20px] text-[18px] font-medium text-[#C6C6C6]">
                    파일을 업로드 해주세요.
                  </p>
                </div>
              )}
              <label
                htmlFor="upload-video"
                className="border-gray-border-color bg-bg-gray-color hover:bg-primary-color w-[12%] cursor-pointer rounded-2xl border px-[25px] py-[20px] text-center text-[18px] font-semibold text-[#343434] transition-all duration-200 hover:text-white"
              >
                영상 찾기
              </label>
              <input
                id="upload-video"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => uploadVideo(e.target.files[0])}
              />
            </div>
          </div>
        </div>
      )}
      <hr className="border-divider-color mt-[40px] border" />
      <div className="mt-[20px] flex justify-end gap-3">
        <button
          className="border-gray-border-color bg-bg-gray-color rounded-2xl border p-[10px]"
          onClick={() => setIsActive(false)}
        >
          <p className="text-[18px] font-semibold">뒤로가기</p>
        </button>
        {checkInstructor && (
          <button
            className="border-gray-border-color bg-primary-color rounded-2xl border p-[10px]"
            onClick={() => addVideoMutaion.mutate()}
          >
            <p className="text-[18px] font-semibold text-white">자료 업로드</p>
          </button>
        )}
      </div>
    </>
  );
};
