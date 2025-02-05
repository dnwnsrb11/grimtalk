import { useQuery } from '@tanstack/react-query';

import { _axiosAuth } from '@/api/instance';
import { CommunityList } from '@/components/mainPages/community/CommunityList';
// 내가 쓴 글 컴포넌트
export const MyBoardSection = () => {
  const boardList = Array.from({ length: 3 });
  const { data: myQuestions } = useQuery({
    queryKey: ['myQuestions'],
    queryFn: async () => {
      const { data } = await _axiosAuth.get('/mypage/board');

      return data.body.data.list;
    },
  });
  return (
    <>
      {myQuestions?.map((question, index) => (
        <CommunityList key={index} />
      ))}
    </>
  );
};
