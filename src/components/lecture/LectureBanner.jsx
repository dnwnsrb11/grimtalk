import BannerIMG from '@/assets/banner/lectureBannerIMG.png';

export const LectureBanner = () => {
  return (
    <>
      <div className="relative h-[300px] w-full rounded-xl">
        <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-white via-transparent to-transparent opacity-100"></div>
        <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-l from-white via-transparent to-transparent opacity-100"></div>
        <div className="absolute bottom-[-1%] left-0 h-full w-full bg-gradient-to-t from-white via-transparent to-transparent opacity-100"></div>
        <div>
          <img src={BannerIMG} alt="BannerIMG" className="h-full w-full rounded-xl object-cover" />
        </div>
      </div>
    </>
  );
};
