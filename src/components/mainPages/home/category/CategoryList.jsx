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
  const [categoryNameHover, setCategoryNameHover] = useState('');
  const changeCategory = (name) => {
    // 카테고리 클릭시 활성화 하게 할려고 준비중
    setCategoryName(name);
  };
  const HoverCategory = (name) => {
    // 호버시에도 동일하게 변경을 주고 싶음
    setCategoryNameHover(name);
  };

  return (
    <>
      <div className="flex gap-7">
        <div className="flex flex-col items-center">
          <div
            onClick={() => changeCategory('all')}
            className={`max-h-[70px] rounded-xl border border-[#C6C6C6] p-5 ${categoryName === 'all' ? 'shadow-md' : ''}`}
          >
            {categoryName === 'all' ? (
              <img src={allActiveSVG} alt="" />
            ) : (
              <img src={allDeactiveSVG} alt="" />
            )}
          </div>
          <div className="mt-1">
            {categoryName === 'all' ? (
              <h3 className="text-lg font-bold text-primary-color">전체</h3>
            ) : (
              <h3 className="text-lg font-medium ">전체</h3>
            )}
          </div>
        </div>
        {/* 캐릭터 */}
        <div className="flex flex-col items-center">
          <div
            onClick={() => changeCategory('character')}
            className={`flex  max-h-[70px] rounded-xl border border-[#C6C6C6] p-5 ${categoryName === 'character' ? 'shadow-md' : ''}`}
          >
            {categoryName === 'character' ? (
              <img src={characterActiveSVG} alt="" />
            ) : (
              <img src={characterDeactiveSVG} alt="" />
            )}
          </div>
          <div className="mt-1">
            {categoryName === 'character' ? (
              <h3 className="text-lg font-bold text-primary-color">캐릭터</h3>
            ) : (
              <h3 className="text-lg font-medium ">캐릭터</h3>
            )}
          </div>
        </div>
        {/* 이모티콘 */}
        <div className="flex flex-col items-center">
          <div
            onClick={() => changeCategory('emoticon')}
            className={`flex  max-h-[70px] rounded-xl border border-[#C6C6C6] p-5 ${categoryName === 'emoticon' ? 'shadow-md' : ''}`}
          >
            {categoryName === 'emoticon' ? (
              <img src={emoticonActiveSVG} alt="" />
            ) : (
              <img src={emoticonDeactiveSVG} alt="" />
            )}
          </div>
          <div className="mt-1">
            {categoryName === 'emoticon' ? (
              <h3 className="text-lg font-bold text-primary-color">이모티콘</h3>
            ) : (
              <h3 className="text-lg font-medium ">이모티콘</h3>
            )}
          </div>
        </div>
        {/* 드로잉 */}
        <div className="flex flex-col items-center">
          <div
            onClick={() => changeCategory('drawing')}
            className={`flex  max-h-[70px] rounded-xl border border-[#C6C6C6] p-5 ${categoryName === 'drawing' ? 'shadow-md' : ''}`}
          >
            {categoryName === 'drawing' ? (
              <img src={drawingActiveSVG} alt="" />
            ) : (
              <img src={drawingDeactiveSVG} alt="" />
            )}
          </div>
          <div className="mt-1">
            {categoryName === 'drawing' ? (
              <h3 className="text-lg font-bold text-primary-color">드로잉</h3>
            ) : (
              <h3 className="text-lg font-medium ">드로잉</h3>
            )}
          </div>
        </div>
        {/* 컬러링 */}
        <div className="flex flex-col items-center">
          <div
            onClick={() => changeCategory('coloring')}
            className={`flex  max-h-[70px] rounded-xl border border-[#C6C6C6] p-5 ${categoryName === 'coloring' ? 'shadow-md' : ''}`}
          >
            {categoryName === 'coloring' ? (
              <img src={coloringActiveSVG} alt="" />
            ) : (
              <img src={coloringDeactiveSVG} alt="" />
            )}
          </div>
          <div className="mt-1">
            {categoryName === 'coloring' ? (
              <h3 className="text-lg font-bold text-primary-color">컬러링</h3>
            ) : (
              <h3 className="text-lg font-medium ">컬러링</h3>
            )}
          </div>
        </div>
        {/* 웹툰 */}
        <div className="flex flex-col items-center">
          <div
            onClick={() => changeCategory('webtoon')}
            className={`flex  max-h-[70px] rounded-xl border border-[#C6C6C6] p-5 ${categoryName === 'webtoon' ? 'shadow-md' : ''}`}
          >
            {categoryName === 'webtoon' ? (
              <img src={webtoonActiveSVG} alt="" />
            ) : (
              <img src={webtoonDeactiveSVG} alt="" />
            )}
          </div>
          <div className="mt-1">
            {categoryName === 'webtoon' ? (
              <h3 className="text-lg font-bold text-primary-color">웹툰</h3>
            ) : (
              <h3 className="text-lg font-medium ">웹툰</h3>
            )}
          </div>
        </div>
        {/* 컨셉 아트 */}
        <div className="flex flex-col items-center">
          <div
            onClick={() => changeCategory('art')}
            className={`flex  max-h-[70px] rounded-xl border border-[#C6C6C6] p-5 ${categoryName === 'art' ? 'shadow-md' : ''}`}
          >
            {categoryName === 'art' ? (
              <img src={artActiveSVG} alt="" />
            ) : (
              <img src={artDeactiveSVG} alt="" />
            )}
          </div>
          <div className="mt-1">
            {categoryName === 'art' ? (
              <h3 className="text-lg font-bold text-primary-color">컨셉 아트</h3>
            ) : (
              <h3 className="text-lg font-medium ">컨셉 아트</h3>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
