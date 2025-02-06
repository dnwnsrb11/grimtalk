import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { _axiosAuth } from '@/api/instance';
import { LoadingComponents } from '@/components/common/LoadingComponents';

export const LectureNoticeDetail = ({ noticeDate, setIsActive }) => {
  const navigate = useNavigate();
  // api 호출
  const {
    data: notice,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['notice'],
    queryFn: async () => {
      const { data } = await _axiosAuth.get(`/notice/detail/${noticeDate.noticeId}`);
      return data.body.data;
    },
    onError: (error) => {
      navigate('/notfound');
    },
  });
  const changeActive = () => {
    setIsActive('/');
  };
  if (isLoading) {
    return <LoadingComponents />;
  }
  return (
    <>
      <div className="mt-[60px]">
        <h1 className="text-[32px] font-bold">{notice.subject}</h1>
        <div className="mt-[10px]">
          <p className="text-[18px]">{notice.content}</p>
        </div>
      </div>
      <hr />
      <hr className="mt-[40px] border border-divider-color" />
      <div className="mt-[20px] flex justify-end">
        <button
          className="rounded-2xl border border-gray-border-color bg-bg-gray-color p-[10px]"
          onClick={() => changeActive()}
        >
          <p className="text-[18px] font-semibold">뒤로가기</p>
        </button>
      </div>
    </>
  );
};
