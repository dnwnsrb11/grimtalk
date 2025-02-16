// 아이콘 가져오기
import { useState } from 'react';

import allActiveSVG from '@/assets/category/all-active.svg';
import allDeactiveSVG from '@/assets/category/all-deactive.svg';
import artActiveSVG from '@/assets/category/art-active.svg';
import artDeactiveSVG from '@/assets/category/art-deactive.svg';
import characterActiveSVG from '@/assets/category/character-active.svg';
import characterDeactiveSVG from '@/assets/category/character-deactive.svg';
import coloringActiveSVG from '@/assets/category/coloring-active.svg';
import coloringDeactiveSVG from '@/assets/category/coloring-deactive.svg';
import drawingActiveSVG from '@/assets/category/drawing-active.svg';
import drawingDeactiveSVG from '@/assets/category/drawing-deactive.svg';
import emoticonActiveSVG from '@/assets/category/emoticon-active.svg';
import emoticonDeactiveSVG from '@/assets/category/emoticon-deactive.svg';
import webtoonActiveSVG from '@/assets/category/webtoon-active.svg';
import webtoonDeactiveSVG from '@/assets/category/webtoon-deactive.svg';

export const CategoryList = ({ onCategoryChange }) => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryNameHover, setCategoryNameHover] = useState('');
  const changeCategory = (name) => {
    // 현재 위치를 알리는 콘솔로그
    setCategoryName(name);
    setCategoryNameHover(name);
    onCategoryChange(name);
  };
  const hoverCategory = (name) => {
    // 호버시에도 동일하게 변경을 주고 싶음
    setCategoryNameHover(name);
  };
  const leaveCategory = () => {
    setCategoryNameHover('');
  };

  return (
    <button>
      <div className="flex gap-7">
        <div className="flex flex-col items-center">
          <div
            onClick={() => changeCategory('')}
            onMouseEnter={() => hoverCategory('')}
            onMouseLeave={() => leaveCategory()}
            className={`max-h-[70px] rounded-xl border border-[#C6C6C6] p-5 ${categoryName === '' || categoryNameHover === '' ? 'shadow-md' : ''}`}
          >
            {categoryName === '' && categoryNameHover === '' ? (
              <img src={allActiveSVG} alt="" />
            ) : (
              <img src={allDeactiveSVG} alt="" />
            )}
          </div>
          <div className="mt-1">
            {categoryName === '' && categoryNameHover === '' ? (
              <h3 className="text-lg font-bold text-primary-color">전체</h3>
            ) : (
              <h3 className="text-lg font-medium ">전체</h3>
            )}
          </div>
        </div>
        {/* 캐릭터 */}
        <div className="flex flex-col items-center">
          <div
            onClick={() => changeCategory('CHARACTER')}
            onMouseEnter={() => hoverCategory('CHARACTER')}
            onMouseLeave={() => leaveCategory()}
            className={`flex  max-h-[70px] rounded-xl border border-[#C6C6C6] p-5 ${categoryName === 'CHARACTER' || categoryNameHover === 'CHARACTER' ? 'shadow-md' : ''}`}
          >
            {categoryName === 'CHARACTER' || categoryNameHover === 'CHARACTER' ? (
              <img src={characterActiveSVG} alt="" />
            ) : (
              <img src={characterDeactiveSVG} alt="" />
            )}
          </div>
          <div className="mt-1">
            {categoryName === 'CHARACTER' || categoryNameHover === 'CHARACTER' ? (
              <h3 className="text-lg font-bold text-primary-color">캐릭터</h3>
            ) : (
              <h3 className="text-lg font-medium ">캐릭터</h3>
            )}
          </div>
        </div>
        {/* 이모티콘 */}
        <div className="flex flex-col items-center">
          <div
            onClick={() => changeCategory('EMOTICON')}
            onMouseEnter={() => hoverCategory('EMOTICON')}
            onMouseLeave={() => leaveCategory()}
            className={`flex  max-h-[70px] rounded-xl border border-[#C6C6C6] p-5 ${categoryName === 'EMOTICON' || categoryNameHover === 'EMOTICON' ? 'shadow-md' : ''}`}
          >
            {categoryName === 'EMOTICON' || categoryNameHover === 'EMOTICON' ? (
              <img src={emoticonActiveSVG} alt="" />
            ) : (
              <img src={emoticonDeactiveSVG} alt="" />
            )}
          </div>
          <div className="mt-1">
            {categoryName === 'EMOTICON' || categoryNameHover === 'EMOTICON' ? (
              <h3 className="text-lg font-bold text-primary-color">이모티콘</h3>
            ) : (
              <h3 className="text-lg font-medium ">이모티콘</h3>
            )}
          </div>
        </div>
        {/* 드로잉 */}
        <div className="flex flex-col items-center">
          <div
            onClick={() => changeCategory('DRAWING')}
            onMouseEnter={() => hoverCategory('DRAWING')}
            onMouseLeave={() => leaveCategory()}
            className={`flex  max-h-[70px] rounded-xl border border-[#C6C6C6] p-5 ${categoryName === 'DRAWING' || categoryNameHover === 'DRAWING' ? 'shadow-md' : ''}`}
          >
            {categoryName === 'DRAWING' || categoryNameHover === 'DRAWING' ? (
              <img src={drawingActiveSVG} alt="" />
            ) : (
              <img src={drawingDeactiveSVG} alt="" />
            )}
          </div>
          <div className="mt-1">
            {categoryName === 'DRAWING' || categoryNameHover === 'DRAWING' ? (
              <h3 className="text-lg font-bold text-primary-color">드로잉</h3>
            ) : (
              <h3 className="text-lg font-medium ">드로잉</h3>
            )}
          </div>
        </div>
        {/* 컬러링 */}
        <div className="flex flex-col items-center">
          <div
            onClick={() => changeCategory('COLORING')}
            onMouseEnter={() => hoverCategory('COLORING')}
            onMouseLeave={() => leaveCategory()}
            className={`flex  max-h-[70px] rounded-xl border border-[#C6C6C6] p-5 ${categoryName === 'COLORING' || categoryNameHover === 'COLORING' ? 'shadow-md' : ''}`}
          >
            {categoryName === 'COLORING' || categoryNameHover === 'COLORING' ? (
              <img src={coloringActiveSVG} alt="" />
            ) : (
              <img src={coloringDeactiveSVG} alt="" />
            )}
          </div>
          <div className="mt-1">
            {categoryName === 'COLORING' || categoryNameHover === 'COLORING' ? (
              <h3 className="text-lg font-bold text-primary-color">컬러링</h3>
            ) : (
              <h3 className="text-lg font-medium ">컬러링</h3>
            )}
          </div>
        </div>
        {/* 웹툰 */}
        <div className="flex flex-col items-center">
          <div
            onClick={() => changeCategory('WEBTOON')}
            onMouseEnter={() => hoverCategory('WEBTOON')}
            onMouseLeave={() => leaveCategory()}
            className={`flex  max-h-[70px] rounded-xl border border-[#C6C6C6] p-5 ${categoryName === 'WEBTOON' || categoryNameHover === 'WEBTOON' ? 'shadow-md' : ''}`}
          >
            {categoryName === 'WEBTOON' || categoryNameHover === 'WEBTOON' ? (
              <img src={webtoonActiveSVG} alt="" />
            ) : (
              <img src={webtoonDeactiveSVG} alt="" />
            )}
          </div>
          <div className="mt-1">
            {categoryName === 'WEBTOON' || categoryNameHover === 'WEBTOON' ? (
              <h3 className="text-lg font-bold text-primary-color">웹툰</h3>
            ) : (
              <h3 className="text-lg font-medium ">웹툰</h3>
            )}
          </div>
        </div>
        {/* 컨셉 아트 */}
        <div className="flex flex-col items-center">
          <div
            onClick={() => changeCategory('CONCEPT_ART')}
            onMouseEnter={() => hoverCategory('CONCEPT_ART')}
            onMouseLeave={() => leaveCategory()}
            className={`flex  max-h-[70px] rounded-xl border border-[#C6C6C6] p-5 ${categoryName === 'CONCEPT_ART' || categoryNameHover === 'CONCEPT_ART' ? 'shadow-md' : ''}`}
          >
            {categoryName === 'CONCEPT_ART' || categoryNameHover === 'CONCEPT_ART' ? (
              <img src={artActiveSVG} alt="" />
            ) : (
              <img src={artDeactiveSVG} alt="" />
            )}
          </div>
          <div className="mt-1">
            {categoryName === 'CONCEPT_ART' || categoryNameHover === 'CONCEPT_ART' ? (
              <h3 className="text-lg font-bold text-primary-color">컨셉 아트</h3>
            ) : (
              <h3 className="text-lg font-medium ">컨셉 아트</h3>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};
