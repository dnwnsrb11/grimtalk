import BannerIMG from '@/assets/community/communityBannerIMG.png';

export const CommunityBanner = () => {
  return (
    <>
      <div>
        <div className="relative overflow-hidden rounded-lg">
          <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-black via-transparent to-transparent opacity-100"></div>
          <div className="absolute left-[5%] top-1/2 -translate-y-1/2 transform">
            <h3 className="text-[28px] font-bold text-white">묻고 답해요</h3>
            <h3 className="text-[22px] font-light text-white">궁금증을 풀어드립니다.</h3>
          </div>
          <img src={BannerIMG} alt="" className="h-full w-full object-cover" />
        </div>
      </div>
    </>
  );
};
