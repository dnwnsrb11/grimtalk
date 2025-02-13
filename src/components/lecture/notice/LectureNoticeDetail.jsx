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
  const [editContent, setEditContent] = useState(''); // ✨ 수정할 텍스트 상태

  // API 호출
  const {
    data: noticeDetail,
    isLoading,
    isError,
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
    setEditContent(noticeDetail?.content || ''); // 현재 내용으로 초기화
  };

  // 저장 버튼 클릭 시 실행
  const handleSaveClick = async () => {
    try {
      await _axiosAuth.put(`/notice/update/${noticeDate.noticeId}`, {
        content: editContent,
      });
      alert('공지사항이 수정되었습니다.');
      setIsEditing(false);
    } catch (error) {
      alert('수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (isLoading) return <LoadingComponents />;

  return (
    <>
      <div className="mt-[60px]">
        <div>
          <div className="text-[32px] font-bold">{noticeDetail?.subject}</div>
          <div className="text-[14px] text-[#868296]">
            {noticeDetail?.createdAt
              ? new Date(noticeDetail.createdAt).toISOString().replace('T', ' ').slice(0, 16)
              : '날짜 없음'}
          </div>
        </div>
        <div className="ml-[10px] mt-[20px]">
          {isEditing ? (
            <textarea
              className="w-full rounded-md border border-primary-color p-3"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
          ) : (
            <p className="text-[18px]">{noticeDetail?.content}</p>
          )}
        </div>
      </div>
      <hr className="mt-[40px] border border-divider-color" />
      <div className="mt-[20px] flex justify-end gap-3">
        {checkInstructor ? (
          isEditing ? (
            <>
              <button
                className="rounded-2xl border border-gray-border-color bg-bg-gray-color p-[10px]"
                onClick={() => setIsEditing(false)} // 수정 취소 버튼
              >
                <p className="text-[18px] font-semibold">취소</p>
              </button>
              <button
                className="rounded-2xl border border-gray-border-color bg-primary-color p-[10px]"
                onClick={handleSaveClick} // 저장 버튼
              >
                <p className="text-[18px] font-semibold text-white">저장하기</p>
              </button>
            </>
          ) : (
            <button
              className="rounded-2xl border border-gray-border-color bg-primary-color p-[10px]"
              onClick={handleEditClick} // 수정 버튼
            >
              <p className="text-[18px] font-semibold text-white">수정하기</p>
            </button>
          )
        ) : null}

        <button
          className="rounded-2xl border border-gray-border-color bg-bg-gray-color p-[10px]"
          onClick={() => setIsActive('/')}
        >
          <p className="text-[18px] font-semibold">뒤로가기</p>
        </button>
      </div>
    </>
  );
};
