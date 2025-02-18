import { useNavigate } from 'react-router-dom';

import posterNoneImg from '@/assets/posterNoneImg.png';
import {
  RankFourBadgeIcon,
  RankOneBadgeIcon,
  RankThreeBadgeIcon,
  RankTwoBadgeIcon,
} from '@/components/common/icons';
import { useAuthStore } from '@/store/useAuthStore';

export const PopularInstructor = ({ index, instroductor }) => {
  const { id, email, nickname } = useAuthStore((state) => state.userData);
  const navigate = useNavigate();
  const instroductorSubscribed = instroductor?.subscribeNumber || 0;
  const instroductorNickname = instroductor?.nickname || '더미닉네임';
  const instroductorImg = instroductor?.image || posterNoneImg;
  const instroductorTags =
    Array.isArray(instroductor?.memberTags) && instroductor?.memberTags.length > 0
      ? instroductor?.memberTags
      : ['더미태그1', '더미태그2'];
  const instroductorMemberId = instroductor?.memberId;
  // console.log('현재 로그인한 유저 ID:', id);
  // const icons = [rankOneBadgeIcon, rankTwoBadgeIcon, rankThreeBadgeIcon, rankFourBadgeIcon];

  return (
    <>
      <div className="flex items-center justify-between rounded-2xl border p-[20px]">
        <div className="flex items-center gap-4">
          <div>
            {index === 0 ? (
              <RankOneBadgeIcon />
            ) : index === 1 ? (
              <RankTwoBadgeIcon />
            ) : index === 2 ? (
              <RankThreeBadgeIcon />
            ) : (
              <RankFourBadgeIcon />
            )}
          </div>
          {/* <div>
            <img src={PopularIMG1} alt="img" className="h-[38px] w-[38px]" />
          </div> */}
          <div>
            <div className="h-[80px] w-[80px] overflow-hidden rounded-full">
              <img
                src={instroductorImg}
                alt="Profile-img"
                className="h-[100%] w-[100%] object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row gap-5">
              <p className="text-[18px] font-bold">{instroductorNickname}</p>
            </div>
            <div className="mt-1">
              <div className="flex flex-row">
                {' '}
                <div className="mr-1 flex flex-row items-center gap-2 rounded-2xl border bg-primary-color px-3 py-1 text-white">
                  {/* <SubscribeIcon className=" stroke-white text-white transition-colors duration-0 group-hover:stroke-black" /> */}

                  <div className="flex items-center gap-1 font-bold">
                    {' '}
                    <span className="text-[14px] font-light">구독수</span> {instroductorSubscribed}
                  </div>
                </div>
                {instroductorTags?.map((tag, index) => (
                  <div
                    className="mr-1 inline-block rounded-full border bg-bg-gray-color px-3 py-1"
                    key={index}
                  >
                    <p className="text-text-gray-color">{tag}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center gap-5">
          <button
            onClick={() =>
              navigate(`/mypage/${instroductorMemberId}`, {
                state: {
                  joinId: instroductorMemberId,
                  selectedMenu: '유저소개,',
                  selectedProfileMenu: '강사',
                },
              })
            }
            className='className="w-[140px] text-center" px-1 py-3 text-[16px] text-[#828282] transition-all duration-150 hover:text-[17px] hover:text-black'
          >
            <p className=" px-1 font-light ">자세히 보기 &gt;</p>
          </button>
        </div>
      </div>
    </>
  );
};
