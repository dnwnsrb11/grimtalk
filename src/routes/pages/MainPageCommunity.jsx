import { CommunityBanner } from '@/components/mainPages/community/CommunityBanner';
import { CommunityList } from '@/components/mainPages/community/CommunityList';

export const MainPageCommunity = () => {
  return (
    <>
      <div>
        <div>
          <CommunityBanner />
        </div>
        <div>
          <CommunityList />
        </div>
      </div>
    </>
  );
};
