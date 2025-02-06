export const LectureBanner = ({ lecture }) => {
  return (
    <>
      <div className="relative h-[300px] w-full overflow-hidden rounded-xl">
        <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-white via-transparent to-transparent opacity-100"></div>
        <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-l from-white via-transparent to-transparent opacity-100"></div>
        <div className="absolute bottom-0 left-0 h-full w-full bg-gradient-to-t from-white via-transparent to-transparent opacity-100"></div>
        <img
          src={lecture.image}
          alt="BannerIMG"
          className="h-full w-full rounded-xl object-cover"
        />
      </div>
    </>
  );
};
