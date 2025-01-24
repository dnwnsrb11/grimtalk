import BannerIMG from '@/assets/community/communityBannerIMG.png';

export const CommunityBanner = () => {
  return (
    <>
      <div className="w-full">
        <img src={BannerIMG} alt="img" className="w-screen object-cover" />
      </div>
      <div>
        <p>heloo</p>
      </div>
    </>
  );
};
