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
        <div>
          <CategoryList />
        </div>
        <div>{/* 목록 */}</div>
      </div>
    </>
  );
};
