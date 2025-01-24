// 아이콘 가져오기
import allActiveSVG from '@/assets/category/all-active.svg';
import allDeactiveSVG from '@/assets/category/all-deactive.svg';
import artActiveSVG from '@/assets/category/art-active.svg';
import artDeactiveSVG from '@/assets/category/art-deactive.svg';
import characterDeactiveSVG from '@/assets/category/character-deactive.svg';
import characterActiveSVG from '@/assets/category/character-active.svg';
import coloringActiveSVG from '@/assets/category/coloring-active.svg';
import coloringDeactiveSVG from '@/assets/category/coloring-deactive.svg';
import drawingActiveSVG from '@/assets/category/drawing-active.svg';
import drawingDeactiveSVG from '@/assets/category/drawing-deactive.svg';
import emoticonActiveSVG from '@/assets/category/emoticon-active.svg';
import emoticonDeactiveSVG from '@/assets/category/emoticon-deactive.svg';
import webtoonActiveSVG from '@/assets/category/webtoon-active.svg';
import webtoonDeactiveSVG from '@/assets/category/webtoon-deactive.svg';
import { useState } from 'react';

export const CategoryList = () => {
  const [categoryName, setCategoryName] = useState('all');

  return (
    <>
      <div>
        <div>
          <div>
            {categoryName === 'all' ? (
              <img src={allActiveSVG} alt="" />
            ) : (
              <img src={allDeactiveSVG} alt="" />
            )}
          </div>
          <h3>전체</h3>
        </div>
      </div>
    </>
  );
};
