import { Banner } from '@/components/mainPages/home/Banner';
import { CategoryList } from '@/components/mainPages/home/category/CategoryList';

export const MainPageCategory = () => {
  return (
    <>
      <div>
        <div>
          {/* 배너 */}
          <Banner />
        </div>
        <div className="mt-[40px] flex items-center justify-center">
          <div>
            <CategoryList />
          </div>
        </div>
        <div>{/* 목록 */}</div>
      </div>
    </>
  );
};
