import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { _axiosAuth } from '@/api/instance';
import { LoadingComponents } from '@/components/common/LoadingComponents';
import { useAuthStore } from '@/store/useAuthStore';

export const LectureNoticeDetail = ({ noticeDate, setIsActive, checkInstructor }) => {
  const { id } = useAuthStore((state) => state.userData);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false); // ✨ 수정 모드 상태 추가
  const [editSubject, setEditSubject] = useState(''); // ✨ 수정할 제목 상태
  const [editContent, setEditContent] = useState(''); // ✨ 수정할 텍스트 상태

  // API 호출
  const {
    data: noticeDetail,
    isLoading,
    isError,
    refetch, // ✅ 수정 후 다시 데이터를 가져오기 위해 추가
  } = useQuery({
    queryKey: ['noticeDetail', noticeDate?.noticeId],
    queryFn: async () => {
      const { data } = await _axiosAuth.get(`/notice/detail/${noticeDate.noticeId}`);
      return data.body.data;
    },
    onError: () => {
      navigate('/notfound');
    },
  });

  // 수정 버튼 클릭 시 실행
  const handleEditClick = () => {
    setIsEditing(true);
    setEditSubject(noticeDetail?.subject || ''); // ✨ 제목 초기화
    setEditContent(noticeDetail?.content || ''); // ✨ 내용 초기화
  };

  // 저장 버튼 클릭 시 실행
  const handleSaveClick = async () => {
    try {
      await _axiosAuth.put(`/notice/${noticeDate.noticeId}`, {
        content: editContent,
        subject: editSubject,
      });
      alert('공지사항이 수정되었습니다.');
      setIsEditing(false);
      await refetch(); // ✅ 수정 후 새로운 데이터를 가져옴
    } catch (error) {
      alert('수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (isLoading) return <LoadingComponents />;

  return (
    <>
      {isEditing ? (
        <div className="mt-[30px] ">
          <div className="flex flex-col gap-5">
            <p className="text-[30px] font-bold">공지사항 수정하기</p>

            <div className="flex flex-col gap-[15px]">
              <input
                type="text"
                value={editSubject}
                onChange={(e) => setEditSubject(e.target.value)}
                className="min-h-[60px] rounded-2xl border border-gray-border-color p-[20px] focus:border-primary-color focus:outline-none"
                placeholder="공지사항 제목을 입려해주세요."
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[300px] resize-none rounded-2xl border border-gray-border-color p-[20px] focus:border-primary-color focus:outline-none"
                placeholder="공지사항 내용을 입력해주세요."
              ></textarea>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-[60px]">
          <div className="text-[32px] font-bold">{noticeDetail?.subject}</div>
          <div className="text-[14px] text-[#868296]">
            {noticeDetail?.updatedAt
              ? new Date(noticeDetail.updatedAt).toISOString().replace('T', ' ').slice(0, 16)
              : '날짜 없음'}
          </div>

          <p className="mt-[60px] text-[18px]">{noticeDetail?.content}</p>
        </div>
      )}
      <div className="mt-[60px] justify-items-end">
        <div className="text-text-gray-color">작성자 : {noticeDetail?.lectureMemberNickname}</div>
      </div>
      <hr className=" border border-divider-color" />

      <div className="mt-[20px] flex justify-end gap-3">
        {id === noticeDate.lectureMemberId ? (
          isEditing ? (
            <>
              <button
                className="bg-bg-gay-color rounded-2xl border border-gray-border-color p-[10px]"
                onClick={() => setIsEditing(false)} // ✨ 수정 취소 버튼
              >
                <p className="text-[18px] font-semibold">취소</p>
              </button>
              <button
                className="rounded-2xl border border-gray-border-color bg-primary-color p-[10px]"
                onClick={handleSaveClick} // ✨ 저장 버튼 (제목 & 내용 수정)
              >
                <p className="text-[18px] font-semibold text-white">저장하기</p>
              </button>
            </>
          ) : (
            <>
              <button
                className="rounded-2xl border border-gray-border-color bg-bg-gray-color p-[10px]"
                onClick={() => setIsActive('/')}
              >
                <p className="text-[18px] font-semibold">뒤로가기</p>
              </button>
              <button
                className="rounded-2xl border border-gray-border-color bg-primary-color p-[10px]"
                onClick={handleEditClick} // ✨ 수정 버튼
              >
                <p className="text-[18px] font-semibold text-white">수정하기</p>
              </button>
            </>
          )
        ) : (
          <button
            className="rounded-2xl border border-gray-border-color bg-bg-gray-color p-[10px]"
            onClick={() => setIsActive('/')}
          >
            <p className="text-[18px] font-semibold">뒤로가기</p>
          </button>
        )}
      </div>
    </>
  );
};
