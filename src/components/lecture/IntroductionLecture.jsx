import { LoadingComponents } from '@/components/common/LoadingComponents';

export const IntroductionLecture = ({ lecture }) => {
  if (!lecture) {
    return <LoadingComponents />;
  }
  return (
    <>
      <div className="mt-[60px]">
        <h1 className="text-[32px] font-bold">강의 소개</h1>
        <div className="mt-[10px] min-h-[200px]">
          {/* 강의 소개는 임시 텍스트로 변수에 넣어 작성하였습니다. */}
          <p className="text-[18px]">{lecture.intro}</p>
        </div>
      </div>
    </>
  );
};
