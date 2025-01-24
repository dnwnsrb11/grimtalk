import { Banner } from '@/components/mainPages/home/Banner';

export const MainPageLive = () => {
  return (
    <>
      <div>
        <div>
          <Banner />
        </div>
        <div>{/* 인기 라이브 */}</div>
        <hr />
        <div>{/* 전체 라이브 */}</div>
      </div>
    </>
  );
};
