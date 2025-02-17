import Lottie from 'react-lottie';

import HomeBannerMottion from '@/assets/lottie/ApiLoading.json';

export const LoadingComponents = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: HomeBannerMottion,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <>
      <div className="flex h-[calc(100vh-50px)] w-full  items-center justify-center gap-3">
        <div>
          <Lottie options={defaultOptions} height={200} width={200} />
        </div>
        <h2 className="text-text-gray-color text-[20px] font-medium">
          현재 <span className="text-primary-color font-bold">로딩중</span> 입니다 . . .
        </h2>
      </div>
    </>
  );
};
