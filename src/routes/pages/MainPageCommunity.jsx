import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { _axios } from '@/api/instance';
import { LoadingComponents } from '@/components/common/LoadingComponents';
import { CommunityBanner } from '@/components/mainPages/community/CommunityBanner';
import { CommunityList } from '@/components/mainPages/community/CommunityList';

export const MainPageCommunity = () => {
  const navigate = useNavigate();
  // 전체 커뮤니티 목록
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
          <div className="mt-[10px]">
            {communities?.map((community, index) => (
              <CommunityList key={index} community={community} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
