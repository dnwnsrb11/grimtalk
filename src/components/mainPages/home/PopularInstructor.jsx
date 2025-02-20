import toast from 'react-hot-toast';
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
  const { id } = useAuthStore((state) => state.userData);
  const navigate = useNavigate();
  const instroductorSubscribed = instroductor?.subscribeNumber || 0;
  const instroductorNickname = instroductor?.nickname || '더미닉네임';
  const instroductorImg = instroductor?.image || posterNoneImg;
  const instroductorTags =
    Array.isArray(instroductor?.memberTags) && instroductor?.memberTags.length > 0
      ? instroductor?.memberTags
      : ['더미태그1', '더미태그2'];
  const instroductorMemberId = instroductor?.memberId;

  const handleNavigation = () => {
    if (!id) {
      // 로그인이 되어 있지 않으면 로그인 페이지로 이동
      navigate('/login');
      toast.error('로그인 후 이용해주세요.');
    } else {
      // 로그인 상태일 경우 강사 페이지로 이동
      navigate(`/mypage/${instroductorMemberId}`, {
        state: {
          joinId: instroductorMemberId,
          selectedMenu: '유저소개',
          selectedProfileMenu: '강사',
        },
      });
    }
  };

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
                <div className="mr-1 flex flex-row items-center gap-2 rounded-2xl border bg-primary-color px-3 py-1 text-white">
                  <div className="flex items-center gap-1 font-bold">
                    <span className="text-[14px] font-light">구독수</span> {instroductorSubscribed}
                  </div>
                </div>
                {instroductorTags?.map((tag, index) => (
                  <div
                    className="mr-1 inline-block max-w-[70px] rounded-full border bg-bg-gray-color px-3 py-1"
                    key={index}
                  >
                    <p
                      className="overflow-hidden text-ellipsis whitespace-nowrap text-text-gray-color"
                      title={tag}
                    >
                      {tag}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center gap-5">
          <button
            onClick={handleNavigation}
            className="w-[140px] px-1 py-3 text-center text-[14px] text-[#828282] transition-all duration-150 hover:text-black"
          >
            <p className="px-1 font-light">자세히 보기</p>
          </button>
        </div>
      </div>
    </>
  );
};
