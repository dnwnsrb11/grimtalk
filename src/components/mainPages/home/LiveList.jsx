import { useEffect } from 'react';
import testImg from '@/assets/banner/BannerIMG.png';

export const LiveList = () => {
  return (
    <>
      <div>
        <div>
          <img src={testImg} alt="" />
        </div>
        <div>
          {/* 텍스트 구역 */}
          <h4 className="text-lg">이모티콘을 배오고 싶은 당신을 위한 재밌는 강의</h4>
          <div className="flex items-center gap-3">
            <h4 className="text-base font-bold">Name</h4>
            <div>
              <div className="inline-block rounded-full border bg-bg-gray-color px-3 py-1">
                {/* 반복되어 보여진다. */}
                <p className="text-text-gray-color">일러스트</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
