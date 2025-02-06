import { useQuery } from '@tanstack/react-query';

import { _axiosAuth } from '@/api/instance';
import { CommunityList } from '@/components/mainPages/community/CommunityList';

export const MyBoardSection = () => {
  const { data: myQuestions } = useQuery({
    queryKey: ['myQuestions'],
    queryFn: async () => {
      const { data } = await _axiosAuth.get('/mypage/board');
      return data.body.data.list;
    },
  });

  return (
    <>
      {myQuestions && myQuestions.length > 0 ? (
        myQuestions.map((question, index) => <CommunityList key={index} community={question} />)
      ) : (
        <p className="mt-4 flex items-center justify-center text-center text-gray-500">
          작성한 게시글이 없습니다.
        </p>
      )}
    </>
  );
};
