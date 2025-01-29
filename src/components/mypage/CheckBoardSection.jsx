import { CommunityList } from '@/components/mainPages/community/CommunityList';

export const CheckBoardSection = () => {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <CommunityList key={index} />
      ))}
    </>
  );
};
