import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export const LoadingScreen = ({ loadingStep }) => {
  const [progress, setProgress] = useState(0);
  const loadingMessages = [
    '🎨 그림톡에 오신 것을 환영합니다!',
    '✨ 화이트보드를 준비하고 있어요',
    '🖌️ 여러분의 상상력을 펼쳐보세요!',
    '🚀 모든 준비가 완료되었습니다!',
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        // 마지막 단계에서는 100%까지, 그 외에는 95%까지만 진행
        const maxProgress = loadingStep === loadingMessages.length - 1 ? 100 : 95;
        if (prev < maxProgress) {
          return Math.min(prev + 0.3, maxProgress);
        }
        return prev;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [loadingStep, loadingMessages.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
    >
      <div className="flex w-[400px] flex-col items-center gap-8">
        {/* 커스텀 프로그레스 바 */}
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-orange-100">
          <motion.div
            className="absolute left-0 top-0 h-full bg-primary-color"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2, ease: 'linear' }}
          />
        </div>
        <motion.div
          key={loadingStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-2xl font-bold text-primary-color">{loadingMessages[loadingStep]}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};
