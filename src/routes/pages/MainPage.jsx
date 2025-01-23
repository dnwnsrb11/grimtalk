import { LiveList } from '@/components/mainPages/home/LiveList';
import { useState } from 'react';
import { useEffect } from 'react';

export const MainPage = () => {
  const [LiveLists, setLiveLists] = useState([]);
  return (
    <>
      <div>
        <h2>
          인기 있는 <span>라이브</span>
        </h2>
        <div>
          <LiveList />
          {/* {LiveLists.length === 0 ? (
            <p>현재 진행중인 라이브가 없습니다.</p>
          ) : (
            LiveLists.map((list, index) => <LiveList />)
          )} */}
        </div>
      </div>
      <div>{/* 그림 태그 컴포넌트 */}</div>
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
    </>
  );
};
