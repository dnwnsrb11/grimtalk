import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { _axiosAuth } from '@/api/instance';
import { CommunityList } from '@/components/mainPages/community/CommunityList';

export const MyBoardSection = () => {
  const navigate = useNavigate();
  const { data: myQuestions } = useQuery({
    queryKey: ['myQuestions'],
    queryFn: async () => {
      const { data } = await _axiosAuth.get('/mypage/board');
      return data.body.data.list;
    },
    staleTime: 0,
  });

  return (
    <>
      {myQuestions && myQuestions.length > 0 ? (
        myQuestions
          .slice()
          .reverse()
          .map((question, index) => (
            <CommunityList
              key={index}
              community={question}
              onClick={() => {
                navigate(`/lecture/${question.lectureId}`, {
                  state: {
                    selectMenu: '질문사항',
                    routerBoardCreatedId: question?.boardCreatedMemberId,
                    routerBoardBoardId: question?.boardId,
                  },
                });
              }}
            />
          ))
      ) : (
        <p className="mt-4 flex items-center justify-center text-center text-gray-500">
          작성한 게시글이 없습니다.
        </p>
      )}
    </>
  );
};
