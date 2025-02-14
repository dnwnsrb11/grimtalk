import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { _axios } from '@/api/instance';
import { Banner } from '@/components/mainPages/home/Banner';
import { CategoryList } from '@/components/mainPages/home/category/CategoryList';
import { LectureItem } from '@/components/mainPages/home/category/LectureItem';

export const MainPageCategory = () => {
  const [selectedCategory, setSelectCategory] = useState('');
  const location = useLocation();
  const [searchKeywordQuery, setSearchKeywordQuery] = useState('');

  // ✅ 정렬 기준 상태
  const [sortType, setSortType] = useState('recommendation');
  const [visibleLecturesCount, setVisibleLecturesCount] = useState(4); // 기본적으로 4개만 표시
  const [isExpanded, setIsExpanded] = useState(false); // 항목이 확장되었는지 여부

  useEffect(() => {
    const searchQueryFromState = location.state?.search || '';
    setSearchKeywordQuery(searchQueryFromState);
    setSelectCategory('');
  }, [location.state?.search]);

  const { data: categorySearch = [] } = useQuery({
    queryKey: ['categorySearch', selectedCategory, searchKeywordQuery],
    queryFn: async () => {
      const { data } = await _axios.get(
        `/lecture/search/combined?keyword=${searchKeywordQuery}&category=${selectedCategory}&page=1&size=12`,
      );
      return data.body.data.list;
    },
    enabled: true,
  });

  const handleCategoryChange = (category) => {
    setSelectCategory(category);
  };

  // ✅ 추천순 (star 내림차순) & 최신순 (원본 유지) 정렬
  const sortedLectures = useMemo(() => {
    if (sortType === 'recommendation') {
      return [...categorySearch].sort((a, b) => b.star - a.star); // 별점 높은 순
    }
    return [...categorySearch]; // 최신순은 원본 그대로
  }, [categorySearch, sortType]);

  // "더 보기" 버튼 클릭 시 항목 수 4개씩 증가
  const loadMoreLectures = () => {
    setVisibleLecturesCount((prevCount) => prevCount + 4); // 4개씩 증가
  };

  return (
    <div className="mt-10">
      <Banner />
      <div className="mt-[40px] flex items-center justify-center">
        <CategoryList onCategoryChange={handleCategoryChange} />
      </div>

      {/* ✅ 정렬 기준 선택 */}
      <div className="flex flex-col items-end pb-2 pt-[40px]">
        <select
          className="h-10 rounded-md border border-gray-border-color p-2 pl-3 text-[#afafaf]"
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="recommendation">추천순</option>
          <option value="latest">최신순</option>
        </select>
      </div>

      <hr />

      {/* ✅ 정렬된 데이터 렌더링 */}
      {/* ✅ 정렬된 데이터 렌더링 */}
      <div className="mt-[40px] grid grid-cols-4 gap-4 ">
        {categorySearch.length > 0 ? (
          sortedLectures
            .slice(0, visibleLecturesCount)
            .map((search, index) => <LectureItem key={index} search={search} />)
        ) : (
          <div className="col-span-4 flex h-[200px] w-full items-center justify-center rounded-lg border border-gray-300">
            <p className="text-lg font-medium text-gray-500">조회한 결과가 없습니다.</p>
          </div>
        )}
      </div>

      {/* ✅ "더 보기" 버튼 - 4개 이상일 경우만 표시 */}
      {sortedLectures.length > visibleLecturesCount && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={loadMoreLectures}
            className="rounded bg-primary-color px-4 py-2 text-white"
          >
            더 보기
          </button>
        </div>
      )}
    </div>
  );
};
