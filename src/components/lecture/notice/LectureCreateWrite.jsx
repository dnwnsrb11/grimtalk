import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { _axiosAuth } from '@/api/instance';

export const LectureCreateWrite = ({ setIsActive, setCreateNoticeDate, lecture }) => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  const MAX_LENGTH = 1000;

  // 입력 핸들러
  const handleChange = (setter, value, field) => {
    if (value.length > MAX_LENGTH) {
      toast.error(`${field}은(는) ${MAX_LENGTH}자를 초과할 수 없습니다.`, {
        style: { fontSize: '14px', width: '300px' },
      });
      return;
    }
    setter(value);
  };

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
      toast.success('작성이 완료되었습니다.');
      setIsActive('/');
    },
    onError: (error) => {
      console.error('Error:', error);
      toast.error('공지사항 등록에 실패했습니다.');
    },
  });

  const changeActive = () => {
    setIsActive('/');
  };

  return (
    <>
      <div className="mt-[40px]">
        <div className="flex flex-col gap-[15px]">
          <div className="flex flex-col">
            <input
              type="text"
              value={subject}
              onChange={(e) => handleChange(setSubject, e.target.value, '제목')}
              maxLength={MAX_LENGTH}
              className="min-h-[60px] rounded-2xl border border-gray-border-color p-[20px] focus:border-primary-color focus:outline-none"
              placeholder="공지사항 제목을 입력해주세요."
            />
            <small className="mt-1 pl-2 text-gray-500">
              {subject.length}/{MAX_LENGTH}
            </small>
          </div>

          <div className="flex flex-col">
            <textarea
              value={content}
              onChange={(e) => handleChange(setContent, e.target.value, '내용')}
              maxLength={MAX_LENGTH}
              className="min-h-[300px] resize-none rounded-2xl border border-gray-border-color p-[20px] focus:border-primary-color focus:outline-none"
              placeholder="공지사항 내용을 입력해주세요."
            />
            <small className="mt-1 pl-2 text-gray-500">
              {content.length}/{MAX_LENGTH}
            </small>
          </div>
        </div>
        <hr className="mt-[20px] border-gray-border-color" />
        <div className="mt-[20px]">
          <div className="flex justify-end gap-3">
            <button
              className="rounded-2xl border border-gray-border-color bg-bg-gray-color px-[30px] py-[10px]"
              onClick={() => changeActive()}
            >
              <p className="text-[18px] font-semibold">뒤로가기</p>
            </button>
            <button
              className="rounded-2xl bg-primary-color px-[30px] py-[10px]"
              onClick={() => {
                if (!subject.trim() || !content.trim()) {
                  toast.error('제목과 내용을 모두 입력해주세요.');
                  return;
                }
                addNoticeMutation.mutate();
              }}
            >
              <p className="text-[18px] font-semibold text-white">생성하기</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
