import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { _axios } from '@/api/instance';
import { LoadingComponents } from '@/components/common/LoadingComponents';
import { QuestionLectureCard } from '@/components/lecture/question/QuestionLectureCard';
import { QuestionLectureDetail } from '@/components/lecture/question/QuestionLectureDetail';
import { QuestionLectureWrite } from '@/components/lecture/question/QuestionLectureWrite';

export const LectureQuestions = ({ checkInstructor, lecture }) => {
  // 상세 페이지 기능
  const [isActive, setIsActive] = useState('/');
  const [questionId, setQuestionId] = useState('');
  const [curriculumId, setCurriculumId] = useState('');

  // 목록 조회
  const {
    data: questions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['questions', isActive],
    queryFn: async () => {
      const { data } = await _axios.get(`/lecture/board/${lecture.lectureId}`);

      if (!data.body.data.list) {
        throw new Error('데이터가 없습니다.');
      }

      return data.body.data.list;
    },
    onError: (error) => {
      alert('에러');
    },
  });

  // 뒤로가기 버튼 기능
  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault();
      setIsActive('/');
    };
    if (isActive !== '/') {
      // popstate 이벤트 리스너 등록
      window.addEventListener('popstate', handlePopState);

      // 초기 상태로 히스토리를 추가하여 뒤로가기 기능을 막음
      // 이를 통해 뒤로가기 버튼을 클릭하면 isActive 값만 변경됨
      history.pushState(null, document.title);
    } else {
      // isActive가 false일 때는 popstate 이벤트 리스너 제거
      window.removeEventListener('popstate', handlePopState);
    }
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isActive]);

  if (isLoading) {
    return <LoadingComponents />;
  }
  if (isError) return <div>에러가 발생했습니다.</div>;

  // 컴포넌트 생성 분기
  if (isActive === '질문 상세페이지') {
    return (
      <QuestionLectureDetail
        setIsActive={setIsActive}
        questionId={questionId}
        checkInstructor={checkInstructor}
      />
    );
  } else if (isActive === '질문 작성페이지') {
    return (
      <QuestionLectureWrite
        setIsActive={setIsActive}
        curriculumId={curriculumId}
        lecture={lecture}
      />
    );
  }

  return (
    <>
      <div className="mt-[60px]">
        <div className="mb-[20px] flex gap-6">
          <h1 className="text-[32px] font-bold">질문하기</h1>
          {/* 강사일 경우 질문하기 버튼 안보이게 처리 */}
          {!checkInstructor && (
            <div className="rounded-2xl border bg-primary-color px-[15px] py-[10px]">
              <button onClick={() => setIsActive('질문 작성페이지')}>
                <p className="text-[18px] font-semibold text-white">질문하기</p>
              </button>
            </div>
          )}
        </div>
        <hr className="border border-divider-color" />
        <div className="mt-[40px]">
          {questions && questions.length > 0 ? (
            questions
              .slice() // 원본 배열 변경 방지
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((question, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setIsActive('질문 상세페이지');
                    setQuestionId(question.boardId);
                    setCurriculumId(question.curriculumId);
                  }}
                  className="mb-3"
                >
                  <QuestionLectureCard setIsActive={setIsActive} question={question} />
                </div>
              ))
          ) : (
            <p className="m-[200px] py-4 text-center text-lg text-gray-500">
              등록된 질문이 없습니다.
            </p>
          )}
        </div>
      </div>
    </>
  );
};
