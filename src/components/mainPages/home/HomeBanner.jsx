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
    <>
      <div className="mb-28 flex items-center justify-between gap-2">
        {/* 제목,소제목, 내용 */}
        <div>
          <h1 className="text-[64px] font-extrabold leading-tight text-[#FF5C38]">
            {text1}
            <br />
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
                className={char === ' ' ? 'inline-block' : 'inline-block'}
                style={char === ' ' ? { whiteSpace: 'pre' } : {}}
              >
                {char}
              </motion.span>
            ))}
          </h1>
          <div className="mt-[25px] inline-block rounded-full border px-[25px] py-[5px]">
            <h3 className="text-[24px] font-semibold text-[#828282]">
              <span className="text-[#FF5C38]">실시간 그림 공유</span>로 더 가까운 배움
            </h3>
          </div>
          <p className="mt-[40px] whitespace-pre-line break-keep text-[20px] font-normal leading-relaxed text-[#070707]">
            강사의 손끝에서 완성되는 그림을 내 눈앞에서 그대로! 실시간으로 보고 따라 그리며,
            <br />
            자연스럽게 실력을 키우고, 다양한 그림 기법까지 익혀보세요.
            <br />
            혼자서 어렵게 고민할 필요 없이, 강사의 작업을 실시간으로 보며 쉽게 배울 수 있습니다.
            <br />
            <span className="font-bold text-[#FF5C38]">그림톡</span>에서 당신의 창의력을 마음껏
            펼쳐보세요!
          </p>
        </div>
        <div>
          <Lottie options={defaultOptions} height={500} width={550} />
        </div>
      </div>
    </>
  );
};
