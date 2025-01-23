import { Banner } from '@/components/mainPages/home/Banner';
import { LiveList } from '@/components/mainPages/home/LiveList';
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
        <div>
          <Banner />
        </div>
        <div>
          <div>
            <h2>
              <span>인기</span> 강사
            </h2>
            <div>{/* 인기강사 */}</div>
          </div>
          <div>
            <h2>
              요즘 <span>뜨는</span> 강사
            </h2>
            <div>{/* 인기강사 */}</div>
          </div>
        </div>
        <div>
          <h2>
            <span>인기</span> 있는 강의
          </h2>
          <div>{/* 인기 있는 강사 컴포넌트 */}</div>
        </div>
      </div>
    </>
  );
};
