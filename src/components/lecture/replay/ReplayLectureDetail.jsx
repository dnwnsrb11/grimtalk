import { useState } from 'react';

export const ReplayLectureDetail = ({ replayDate, setIsActive, checkInstructor }) => {
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
  return (
    <>
      <div className="mt-[60px]">
        <div className="min-h-[300px]">
          <h1 className="text-[32px] font-bold">커리큘럼 1. 새로운 시작</h1>
          <p className="text-[18px] font-medium">{replayDate}</p>
        </div>
        <div className="mt-[10px] flex items-center justify-center">
          <button className="rounded-2xl border bg-primary-color px-[120px] py-[20px] text-center">
            <p className="text-[18px] font-semibold text-white">다시보기</p>
          </button>
        </div>
      </div>
      {/* 강사일 경우 랜더링 - 업로드 기능 */}
      <div className="mt-[50px]">
        <hr className="mt-[40px] border border-divider-color" />
        <div className="mt-[20px]">
          <h1 className="text-[32px] font-bold">다시보기 파일 업로드</h1>
          <div className="mt-[20px] flex justify-between gap-3">
            {video ? (
              <div className="flex w-[85%] items-center rounded-2xl border bg-bg-gray-color">
                <p className="px-[20px] text-[18px] font-medium text-[#C6C6C6]">{video.name}</p>
              </div>
            ) : (
              <div className="flex w-[85%] items-center rounded-2xl border bg-bg-gray-color">
                <p className="px-[20px] text-[18px] font-medium text-[#C6C6C6]">
                  파일을 업로드 해주세요.
                </p>
              </div>
            )}
            <label
              htmlFor="upload-video"
              className="w-[12%] cursor-pointer rounded-2xl border border-gray-border-color bg-bg-gray-color px-[25px] py-[20px] text-center text-[18px] font-semibold text-[#343434] transition-all duration-200 hover:bg-primary-color hover:text-white"
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
        {/* 이미지 (완성작) 업로드 */}
        <div className="mt-[50px]">
          <h1 className="text-[32px] font-bold">다시보기 파일 업로드</h1>
          <div className="mt-[20px] flex justify-between gap-3">
            {drawingImg ? (
              <div className="flex w-[85%] items-center rounded-2xl border bg-bg-gray-color">
                <p className="px-[20px] text-[18px] font-medium text-[#C6C6C6]">
                  {drawingImg.name}
                </p>
              </div>
            ) : (
              <div className="flex w-[85%] items-center rounded-2xl border bg-bg-gray-color">
                <p className="px-[20px] text-[18px] font-medium text-[#C6C6C6]">
                  완성작을 업로드 해주세요.
                </p>
              </div>
            )}
            <label
              htmlFor="upload-video"
              className="w-[12%] cursor-pointer rounded-2xl border border-gray-border-color bg-bg-gray-color px-[25px] py-[20px] text-center text-[18px] font-semibold text-[#343434] transition-all duration-200 hover:bg-primary-color hover:text-white"
            >
              완성작 찾기
            </label>
            <input
              id="upload-video"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => uploadDrawingImg(e.target.files[0])}
            />
          </div>
        </div>
      </div>
      <hr className="mt-[40px] border border-divider-color" />
      <div className="mt-[20px] flex justify-end">
        <button
          className="rounded-2xl border border-gray-border-color bg-bg-gray-color p-[10px]"
          onClick={() => setIsActive(false)}
        >
          <p className="text-[18px] font-semibold">뒤로가기</p>
        </button>
      </div>
    </>
  );
};
