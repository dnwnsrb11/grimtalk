import { Banner } from '@/components/mainPages/home/Banner';
import { LiveList } from '@/components/mainPages/home/LiveList';

export const MainPageLive = () => {
  return (
    <div className="mt-10">
      <Banner />
      <div className="mt-[50px]">
        <h2 className="mb-[15px] text-2xl font-bold">
          인기 있는 <span className="text-primary-color">라이브</span>
        </h2>
        <div className="mb-[50px] flex gap-3">
          {Array.from({ length: 4 }, (_, index) => (
            <LiveList />
          ))}
        </div>
      </div>
      <hr className="border-[#ACACAC]" />
      <div>
        <div className="mt-[50px]">
          <h2 className="mb-[15px] text-2xl font-bold">
            전체 <span className="text-primary-color">라이브</span>
          </h2>
          <div className="mb-[50px] flex flex-wrap gap-3">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="mb-[40px] w-[calc(25%_-_0.75rem)]">
                <LiveList />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
