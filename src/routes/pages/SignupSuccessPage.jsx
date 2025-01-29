import { LoginHi } from '@/components/common/icons';

export const SignupSuccessPage = () => {
  return (
    <div className="mx-auto flex h-full flex-col items-center justify-center">
      <div className="flex flex-col  justify-center">
        {/* 문장 전체를 감싸는 flex 컨테이너 */}
        <div className="flex flex-row">
          <div className="mr-[50px] flex flex-col">
            <h1 className="mb-[20px]">
              <span className="mr-2 text-5xl font-bold">OOO님</span>
              <span className="text-5xl font-bold text-primary-color">가입을 환영해요.</span>
            </h1>
            <p className="text-3xl text-[#A8A8A8]">가입이 완료되었습니다.</p>
            <p className="text-3xl text-[#A8A8A8]">그림톡에서 미술 실력을 키워보세요.</p>
          </div>
          <LoginHi />
        </div>
        <div className="mt-[40px] flex">
          <button className="text-s h-[53px] w-[304px] rounded-3xl bg-primary-color text-white">
            로그인 창으로 →
          </button>
        </div>
      </div>

      {/* 버튼을 텍스트들 아래로 배치 */}
    </div>
  );
};
