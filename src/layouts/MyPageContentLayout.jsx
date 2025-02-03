import { useQuery } from '@tanstack/react-query';

import { _axios } from '@/api/instance';
export const MyPageContentLayout = ({ navMenuTitle, navMenuSubButton, children }) => {
  const {
    data: myquestions,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['myquestions'],
    queryFn: async () => {
      const { data } = await _axios.get(`/mypage/board`);
      return data;
    },
  });

  return (
    <>
      <div className="mt-10 flex flex-row items-center gap-2">
        <div className="text-2xl font-bold">{navMenuTitle}</div>
        {navMenuSubButton && navMenuSubButton}
      </div>
      <hr className="w-full" />
      {children}
    </>
  );
};
