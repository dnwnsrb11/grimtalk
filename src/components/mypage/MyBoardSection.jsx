import { CommunityList } from '@/components/mainPages/community/CommunityList';
// 내가 쓴 글 컴포넌트
export const MyBoardSection = () => {
  const boardList = Array.from({ length: 3 });
  return (
    <>
      {boardList.map((_, index) => (
        <CommunityList key={index} />
      ))}
    </>
  );
};
