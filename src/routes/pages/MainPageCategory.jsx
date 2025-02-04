import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { _axios } from '@/api/instance';
import { Banner } from '@/components/mainPages/home/Banner';
import { CategoryList } from '@/components/mainPages/home/category/CategoryList';
import { LectureItem } from '@/components/mainPages/home/category/LectureItem';

export const MainPageCategory = () => {
  // 카테고리 상태
  const [selectedCategory, setSelectCategory] = useState('');
  // Location을 통해 URL 상태 가져오기
  const Location = useLocation();
  const [searchKeywordQuery, setSearchKeywordQuery] = useState('');

  // 새로고침 시 searchKeywordQuery와 selectedCategory 초기화
  useEffect(() => {
    // 검색어 초기화
    const searchQueryFromState = Location.state?.search || ''; // 빈 문자열 처리
    setSearchKeywordQuery(searchQueryFromState);
    setSelectCategory(''); // 카테고리 초기화
  }, [Location.state?.search]);

  // 조회 API
  const { data: categorySearch } = useQuery({
    queryKey: ['categorySearch', selectedCategory, searchKeywordQuery || ''],
    queryFn: async () => {
      // 검색어가 없다면 빈 배열을 반환
      const { data } = await _axios.get(
        `/lecture/search/combined?keyword=${searchKeywordQuery}&category=${selectedCategory}&page=1&size=12`,
      );
      return data.body.data.list;
    },
    enabled: true,
  });

  // 카테고리 변경
  const handleCategoryChange = (category) => {
    setSelectCategory(category);
  };

  return (
    <div className="mt-10">
      <Banner />
      <div className="mt-[40px] flex items-center justify-center">
        <div>
          <CategoryList onCategoryChange={handleCategoryChange} />
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
        {categorySearch?.map((search, index) => (
          <LectureItem key={index} search={search} />
        ))}
      </div>
    </div>
  );
};
