// import BannerIMG from '@/assets/community/communityBannerIMG.png';
import CommunityBannerIMG from '@/assets/banner/communityBannerIMG.png';
export const CommunityBanner = () => {
  return (
    <>
      <div>
        <div className="relative max-h-[350px] overflow-hidden rounded-lg">
          <div className="absolute left-0 top-0 z-20 h-full w-full bg-gradient-to-r from-black via-transparent to-transparent opacity-100"></div>
          <div className="absolute left-[5%] top-1/2 z-30 -translate-y-1/2 transform">
            <h3 className="text-[32px] text-white">궁금한게 있다면?</h3>
            <h3 className="text-[66px] font-extrabold text-[#FF5C38]">COMMUNITY</h3>
          </div>
          <img
            src={CommunityBannerIMG}
            alt=""
            className="animate-scale h-full w-full object-cover"
          />
          <style jsx>{`
            @keyframes scale {
              0% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.1);
              }
              100% {
                transform: scale(1);
              }
            }
            .animate-scale {
              animation: scale 15s ease-in-out infinite;
            }
          `}</style>
        </div>
      </div>
    </>
  );
};
