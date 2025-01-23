import BannerIMG from '@/assets/banner/BannerIMG.png';
export const Banner = () => {
  return (
    <>
      <div>
        <div className="relative overflow-hidden rounded-lg">
          <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-black via-transparent to-transparent opacity-100"></div>
          <div className="absolute left-[5%] top-1/2 -translate-y-1/2 transform">
            <h3 className="text-[28px] text-white">그림을 배우고 싶다면?</h3>
            <h3 className="text-[28px] text-white">GRIMTALK</h3>
          </div>
          <img src={BannerIMG} alt="" className="h-full w-full object-cover" />
        </div>
      </div>
    </>
  );
};
