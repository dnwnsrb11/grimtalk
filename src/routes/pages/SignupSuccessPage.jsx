import { AnimatePresence, motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

import { LoginHi } from '@/components/common/icons';

export const SignupSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      <motion.div
        key="signup-success"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }} // 1.2초 딜레이 후 나타남
        className="mx-auto mb-[250px] mt-[250px] flex h-full flex-col items-center justify-center"
      >
        <motion.div
          className="flex flex-col justify-center"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }} // 텍스트는 살짝 늦게 등장
        >
          <div className="flex flex-row">
            <motion.div
              className="mr-[50px] flex flex-col"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h1 className="mb-[20px]">
                <span className="mr-2 text-5xl font-bold">OOO님</span>
                <span className="text-5xl font-bold text-primary-color">가입을 환영해요.</span>
              </h1>
              <p className="text-3xl text-[#A8A8A8]">가입이 완료되었습니다.</p>
              <p className="text-3xl text-[#A8A8A8]">그림톡에서 미술 실력을 키워보세요.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }} // 아이콘은 오른쪽에서 등장
            >
              <LoginHi />
            </motion.div>
          </div>

          <motion.div
            className="mt-[40px] flex"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }} // 버튼은 아래에서 위로 슬라이드
          >
            <button
              className="text-s h-[53px] w-[304px] rounded-3xl bg-primary-color text-white"
              onClick={() => navigate(`/login`)}
            >
              로그인 창으로 →
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
