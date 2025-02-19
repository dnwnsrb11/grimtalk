import { motion } from 'motion/react';
import Lottie from 'react-lottie';

import MainBannerMove from '@/assets/lottie/MainBannerMove.json';

export const HomeBanner = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: MainBannerMove,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  const text1 = '강사의 붓 터치가';
  const text2 = '내 캔버스로 !';

  return (
    <div className="flex flex-col items-center justify-between gap-6 md:flex-row lg:mb-[120px]">
      {/* 텍스트 */}
      <div className="text-center md:text-left lg:flex lg:flex-col lg:gap-2">
        <h1 className="text-3xl font-extrabold leading-tight text-[#FF5C38] md:text-5xl lg:flex lg:flex-col lg:gap-4 lg:text-[64px]">
          <div>{text1}</div>
          {/* <br /> */}
          <div>
            {text2.split('').map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0.5, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  repeat: Infinity,
                  repeatType: 'reverse',
                  duration: 1,
                  delay: index * 0.1,
                }}
                className="inline-block"
              >
                {char === ' ' ? '\u00A0' : char} {/* 공백을 깨지 않도록 처리 */}
              </motion.span>
            ))}
          </div>
        </h1>

        <div className="mt-4 inline-block rounded-full border px-4 py-2 md:mt-6 md:px-6">
          <h3 className="text-lg font-semibold text-[#828282] md:text-xl lg:text-2xl">
            <span className="text-[#FF5C38]">실시간 그림 공유</span>로 더 가까운 배움
          </h3>
        </div>
        <p className="mt-6 whitespace-pre-line break-keep text-base font-normal leading-relaxed text-[#070707] md:mt-8 md:text-lg lg:flex lg:flex-col lg:gap-2 lg:text-xl">
          <p>강사의 손끝에서 완성되는 그림을 내 눈앞에서 그대로! 실시간으로 보고 따라 그리며,</p>
          <p>자연스럽게 실력을 키우고, 다양한 그림 기법까지 익혀보세요.</p>
          <p>
            혼자서 어렵게 고민할 필요 없이, 강사의 작업을 실시간으로 보며 쉽게 배울 수 있습니다.
          </p>
          <p>
            <span className="font-bold text-[#FF5C38]">그림톡</span>에서 당신의 창의력을 마음껏
            펼쳐보세요!
          </p>
        </p>
      </div>

      {/* Lottie 애니메이션 */}
      <div>
        <Lottie
          options={defaultOptions}
          width={550} // 기본 크기 (PC)
          height={500}
          style={{
            maxWidth: '100%', // 부모 요소보다 커지지 않도록 설정
            width: '100%', // 기본 크기 유지
          }}
        />
      </div>
    </div>
  );
};
