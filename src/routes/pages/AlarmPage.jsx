import { useState } from 'react';

import CatogoryBannerIMG from '@/assets/community/communityBannerIMG.png';
// 사진 뭘 넣어야 할 지 몰라서 일단 넣어둠
export const AlarmPage = () => {
  const [alarmList, setAlarmList] = useState([
    '디자인_우준규',
    '이모티콘_우정훈',
    '연신내불주먹_임재열',
    '한다면하는남자_류재문',
    '새로운리더_전승기',
  ]);
  return (
    <>
      <div className="relative overflow-hidden rounded-lg">
        <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-black via-transparent to-transparent opacity-100"></div>
        <div className="absolute left-[5%] top-1/2 -translate-y-1/2 transform">
          <h3 className="text-[28px] font-bold text-white">알려드립니다.</h3>
          <h3 className="text-[22px] font-light text-white">
            구독한 강사님들의 다양한 소식들을 전해 드립니다.
          </h3>
        </div>
        <img src={CatogoryBannerIMG} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="pt-[50px]">
        <hr />
        {alarmList.map((alarm, index) => (
          <div className="mb-[20px] mt-[10px] flex cursor-pointer flex-row rounded-3xl border border-gray-border-color px-[22px] py-[15px] transition-colors duration-300 ease-in-out hover:border-primary-color hover:bg-[#ffd8cf] active:border-primary-color active:bg-[#ffd8cf]">
            {/* 왼쪽 이미지 */}

            <img
              src="src/assets/Group.png"
              alt=""
              className="mt-2 h-[63.44px] w-[65.96px] rounded-full bg-primary-color"
            />

            {/* 오른쪽 내용 */}
            <div className="ml-4 flex w-full flex-col justify-center">
              <div className="mb-3 flex items-center gap-3">
                <h2 className="text-[22px] font-bold">[공지] 새로운 강의 등록 안내</h2>
              </div>
              <div className="flex justify-between">
                <div className="rounded-full border bg-bg-gray-color p-1 px-5 text-[14px] font-semibold">
                  <p>2025년 1월 20일</p>
                </div>
              </div>
            </div>
            <div className="ml-4 flex flex-col justify-center ">
              <span className="flex w-auto items-center justify-center whitespace-nowrap pt-10">
                {alarm}
              </span>
              {/* 일단 알아보기 쉽게 초록색으로 해놨습니다 */}
              <hr className="w-auto border-solid border-check-color" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
