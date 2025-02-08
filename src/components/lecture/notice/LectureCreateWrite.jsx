import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { _axiosAuth } from '@/api/instance';

export const LectureCreateWrite = ({ setIsActive, setCreateNoticeDate, lecture }) => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  // api 연결
  const addNoticeMutation = useMutation({
    mutationFn: async () => {
      const { data } = await _axiosAuth.post('/notice', {
        lectureId: lecture.lectureId,
        subject: subject,
        content: content,
      });
      return data;
    },
    onSuccess: () => {
      alert('작성이 완료되었습니다.');
      setIsActive('/');
    },
    onError: (error) => {
      // 에러 처리
      console.error('Error:', error);
      alert('공지사항 등록에 실패했습니다.');
    },
  });
  const changeActive = () => {
    setIsActive('/');
  };
  return (
    <>
      <div className="mt-[40px]">
        <div className="flex flex-col gap-[15px]">
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="min-h-[60px] rounded-2xl border border-gray-border-color p-[20px] focus:border-primary-color focus:outline-none"
            placeholder="공지사항 제목을 입려해주세요."
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[300px] resize-none rounded-2xl border border-gray-border-color p-[20px] focus:border-primary-color focus:outline-none"
            placeholder="공지사항 내용을 입력해주세요."
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
              onClick={() => addNoticeMutation.mutate()}
            >
              <p className="text-[18px] font-semibold text-white">수정하기</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
