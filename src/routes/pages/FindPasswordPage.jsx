import { useNavigate } from 'react-router-dom';
export const FindPasswordPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-10">
      <div className="text-[50px]">비밀번호 찾기 페이지는 추후에 업데이트 됩니다.</div>
      <button
        className="flex h-[3%] w-[10%] items-center justify-center rounded-xl bg-primary-color"
        onClick={() => navigate(`/login`)}
      >
        <div className="text-white">로그인 창으로</div>
      </button>
    </div>
  );
};
