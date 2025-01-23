import { Banner } from '@/components/mainPages/home/Banner';
import { Lecture } from '@/components/mainPages/home/Lecture';
import { LiveList } from '@/components/mainPages/home/LiveList';
import { PopularInstructor } from '@/components/mainPages/home/PopularInstructor';
import { useState } from 'react';
import { useEffect } from 'react';

export const MainPage = () => {
  const [LiveLists, setLiveLists] = useState([]);
  const [count, setCount] = useState([1, 2, 3, 4]);
  return (
    <>
      <div>
        <div>
          <h2 className="text-2xl font-bold">
            인기 있는 <span className="text-primary-color">라이브</span>
          </h2>
          <div className="mt-3 flex gap-3">
            {count.map((c, index) => (
              <LiveList key={index} />
            ))}
          </div>
        </div>
        <div className="mt-[60px]">
          <Banner />
        </div>
        <div className="mb-[15px] mt-[60px] flex  gap-4">
          <div className="w-[50%] ">
            <h2 className="mb-[15px] text-2xl font-bold">
              <span className="text-primary-color">인기</span> 강사
            </h2>
            <div className="flex flex-col gap-4">
              <PopularInstructor />
              <PopularInstructor />
              <PopularInstructor />
            </div>
          </div>
          <div className="w-[50%] ">
            <h2 className="mb-[15px] text-2xl font-bold">
              요즘 <span className="text-primary-color">뜨는</span> 강사
            </h2>
            <div className="flex flex-col gap-4">
              <PopularInstructor />
              <PopularInstructor />
              <PopularInstructor />
            </div>
          </div>
        </div>
        <div className="mt-[60px]">
          <h2 className="mb-[15px] text-2xl font-bold">
            <span className="text-primary-color">인기</span> 있는 강의
          </h2>
          <div className="mt-3 flex gap-3">
            {count.map((c, index) => (
              <Lecture key={index} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
