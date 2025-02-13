import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { _axiosAuth } from '@/api/instance';
import { LoadingComponents } from '@/components/common/LoadingComponents';

export const QuestionLectureWrite = ({ setIsActive, curriculumId, lecture }) => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  // 커리큘럼 이름
  const [curriculumName, setCurriculumName] = useState(null);
  // 커리큘럼 조회
  const {
    data: curriculums,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['curriculums'],
    queryFn: async () => {
      const { data } = await _axiosAuth.get(`/lecture-page/curriculum/${lecture.lectureId}`);
      return data.body.data.list;
    },
    onError: () => {
      navigate('/notfound');
    },
  });

  // 질문 생성 api
  const addQuestionMutaion = useMutation({
    mutationFn: async () => {
      const { data } = await _axiosAuth.post('/board', {
        curriculumId: curriculumName,
        subject: subject,
        content: content,
      });
      return data;
    },
    onSuccess: () => {
      setIsActive(false);
      alert('질문이 작성되었습니다.');
    },
  });
  const changeActive = () => {
    setIsActive('/');
  };

  if (isLoading) {
    return <LoadingComponents />;
  }

  const handleSubjectChange = (e) => {
    if (e.target.value.length <= 240) {
      setSubject(e.target.value);
    } else {
      toast.error('질문 제목 글자 수를 초과했습니다.');
    }
  };

  const handleContentChange = (e) => {
    if (e.target.value.length <= 240) {
      setContent(e.target.value);
    } else {
      toast.error('질문 내용 글자 수를 초과했습니다.');
    }
  };

  return (
    <>
      <div>
        <div className="mb-[10px] mt-[20px] flex gap-3 ">
          <select
            value={curriculumName}
            onChange={(e) => setCurriculumName(e.target.value)}
            className="h-10 w-full rounded-xl border border-gray-border-color p-2 pl-3 text-[#afafaf]"
          >
            <option value="">커리큘럼을 선택해주세요.</option>
            {curriculums.map((curriculum, index) => (
              <option value={curriculum.curriculumId} key={index}>
                {curriculum.subject}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-[15px]">
          <input
            type="text"
            value={subject}
            onChange={handleSubjectChange}
            className="min-h-[60px] rounded-2xl border border-gray-border-color p-[20px] focus:border-primary-color focus:outline-none"
            placeholder="질문 제목을 입력해주세요."
          />
          <textarea
            className="min-h-[300px] resize-none rounded-2xl border border-gray-border-color p-[20px] focus:border-primary-color focus:outline-none"
            placeholder="질문 내용을 입력해주세요."
            value={content}
            onChange={handleContentChange}
          ></textarea>
        </div>
        <hr className="mt-[20px] border-gray-border-color" />
        <div className="mt-[20px]">
          {/* 아래 버튼 */}
          <div className="flex justify-end gap-3">
            <button
              className="rounded-2xl border border-gray-border-color bg-bg-gray-color px-[30px] py-[10px]"
              onClick={() => changeActive()}
            >
              <p className="text-[18px] font-semibold">뒤로가기</p>
            </button>
            <button
              className="rounded-2xl bg-primary-color px-[30px] py-[10px]"
              onClick={() => addQuestionMutaion.mutate()}
            >
              <p className="text-[18px] font-semibold text-white">작성하기</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
