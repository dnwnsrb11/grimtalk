import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { _axios } from '@/api/instance';
import { Banner } from '@/components/mainPages/home/Banner';
import { CategoryList } from '@/components/mainPages/home/category/CategoryList';
import { LectureItem } from '@/components/mainPages/home/category/LectureItem';
export const MainPageCategory = () => {
  // 반복용으로 나둔 요소 추후 변경 예정
  const [count, setCount] = useState([1, 2, 3, 4]);

  const { searchQuery } = useParams(); // URL에서 검색어와 페이지 가져오기

  const { data: categorySearch } = useQuery({
    queryKey: ['categorySearch', searchQuery], // 🔥 페이지네이션 적용
    queryFn: async () => {
      if (!searchQuery) return [];
      const { data } = await _axios.get(`/lecture/search?keyword=${searchQuery}&page=1`);
      return data;
    },
    enabled: !!searchQuery,
  });
  return (
    <div className="mt-10">
      <Banner />
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
      <div className="mt-[40px] flex gap-3">
        {count.map((c, index) => (
          <LectureItem key={index} />
        ))}
      </div>
    </div>
  );
};
