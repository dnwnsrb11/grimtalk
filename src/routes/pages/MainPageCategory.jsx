import { Banner } from '@/components/mainPages/home/Banner';
import { CategoryList } from '@/components/mainPages/home/category/CategoryList';
import { StructorList } from '@/components/mainPages/home/category/LectureList';
import { useState } from 'react';
export const MainPageCategory = () => {
  // 반복용으로 나둔 요소 추후 변경 예정
  const [count, setCount] = useState([1, 2, 3, 4]);
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
        <div className="flex flex-col items-end pb-2 pt-[40px]">
          <div>
            <select className="h-10 rounded-md border border-gray-border-color p-2 pl-3 text-[#afafaf]">
              <option value="recommendation">추천순</option>
              <option value="petName">최신순</option>
            </select>
          </div>
        </div>
        <hr />
        <div>
          <StructorList />
        </div>
      </div>
    </>
  );
};
