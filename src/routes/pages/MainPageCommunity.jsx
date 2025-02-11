import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { _axios } from '@/api/instance';
import { LoadingComponents } from '@/components/common/LoadingComponents';
import { CommunityBanner } from '@/components/mainPages/community/CommunityBanner';
import { CommunityDetail } from '@/components/mainPages/community/CommunityDetail';
import { CommunityList } from '@/components/mainPages/community/CommunityList';

export const MainPageCommunity = () => {
  const [selectedCommunityId, setSelectedCommunityId] = useState(null); // ✅ 선택된 ID 저장
  const navigate = useNavigate();

  // 전체 커뮤니티 목록 가져오기
  const { data: communities, isLoading } = useQuery({
    queryKey: ['communities'],
    queryFn: async () => {
      const { data } = await _axios.get('/board');
      return data.body.data.list;
    },
    onError: () => {
      navigate('/notfound');
    },
  });

  if (isLoading) {
    return <LoadingComponents />;
  }

  return (
    <>
      <div className="mt-10">
        <div>
          <CommunityBanner />
        </div>
        <div className="pt-[50px]">
          <hr />
          <div>
            {selectedCommunityId ? (
              // ✅ 선택된 ID가 있으면 CommunityDetail 렌더링
              <CommunityDetail
                communityId={selectedCommunityId}
                onBack={() => setSelectedCommunityId(null)}
              />
            ) : (
              // ✅ 목록을 렌더링하고 클릭 시 해당 ID 저장
              communities?.map((community) => (
                <CommunityList
                  key={community.id}
                  community={community}
                  onClick={() => setSelectedCommunityId(community.boardId)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};
