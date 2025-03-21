import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { _axios } from '@/api/instance';

export const CommunityDetail = ({ communityId, onBack }) => {
  const [lectureIdWithCommunityId, setLectureIdWithCommunityId] = useState(communityId);
  // ✅ 선택된 커뮤니티 ID를 이용해 데이터 가져오기
  const navigate = useNavigate();
  const { data: community, isLoading } = useQuery({
    queryKey: ['community', communityId],
    queryFn: async () => {
      const { data } = await _axios.get(`/board/${communityId}`);
      return data.body.data;
    },
  });

  if (isLoading) {
    return <p>로딩 중...</p>;
  }

  return (
    <div>
      <div className="mt-[60px] min-h-[200px]">
        <h1 className="text-[32px] font-bold">{community?.subject || ''}</h1>
        <div className="mt-[10px]">
          <p className="text-[18px]">{community?.content || ''}</p>
        </div>
      </div>
      <hr />
      <div className="mt-[20px]">
        <div className="flex items-center gap-3">
          <h1 className="text-[32px] font-bold">답변</h1>
          {community?.comments?.length > 0 ? (
            <div className="rounded-full bg-primary-color px-[10px] py-[5px]">
              <p className="text-[14px] font-semibold text-white">답변</p>
            </div>
          ) : (
            <div className="rounded-full bg-bg-gray-color px-[10px] py-[5px]">
              <p className="text-[14px] font-semibold text-text-gray-color">미답변</p>
            </div>
          )}
        </div>
        <div className="mt-[10px] min-h-[100px]">
          {community?.comments?.length > 0 ? (
            <p className="text-[18px] text-black">{community?.comments[0]?.content || ''}</p>
          ) : (
            <p className="text-[18px] font-medium text-text-gray-color">현재 답변이 없습니다.</p>
          )}
        </div>
      </div>
      <hr />
      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            try {
              navigate(`/lecture/${community.lectureId}`);
            } catch (error) {
              alert('이동에 실패했습니다. 다시 시도해주세요.');
              console.error('Navigation Error:', error);
            }
          }}
          className="mt-[20px] flex rounded-2xl border border-gray-border-color bg-primary-color p-[10px]"
        >
          <p className="text-[18px] font-semibold text-white">강의 이동</p>
        </button>

        <button
          className="mt-[20px] flex rounded-2xl border border-gray-border-color bg-bg-gray-color p-[10px]"
          onClick={onBack}
        >
          <p className="text-[18px] font-semibold">뒤로 가기</p>
        </button>
      </div>
    </div>
  );
};
