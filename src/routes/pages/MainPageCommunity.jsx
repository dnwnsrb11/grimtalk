import { CommunityBanner } from '@/components/mainPages/community/CommunityBanner';
import { CommunityList } from '@/components/mainPages/community/CommunityList';

export const MainPageCommunity = () => {
  const countlist = [1, 2, 3, 4];
  return (
    <div className="mt-10">
      <div>
        <CommunityBanner />
      </div>
      <div className="pt-[50px]">
        <hr />
        <div className="mt-[10px]">
          {countlist.map((c, index) => (
            <CommunityList key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};
