import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import posterNoneImg from '@/assets/posterNoneImg.png';
import { useAuthStore } from '@/store/useAuthStore';
import { useLiveStore } from '@/store/useLiveStore';
import { participantUtils } from '@/utils/participantUtils';

// 라이브 방 카드 컴포넌트
export const LiveList = ({ LiveRoom }) => {
  const navigate = useNavigate();
  const { setRoomCreator } = useLiveStore();
  const { isLogin } = useAuthStore();

  // LiveRoom이 undefined인 경우 early return
  if (!LiveRoom) {
    return null;
  }

  const { curriculumId, curriculumName, hashtags, image, instructorName, lectureId } = LiveRoom;

  const handleJoinLive = async () => {
    if (!isLogin) {
      navigate('/login');
      toast.error('로그인 후 이용해주세요.');
      return;
    }

    try {
      localStorage.setItem('roomCreator', participantUtils.removeTokenPrefix(instructorName));
      setRoomCreator(participantUtils.removeTokenPrefix(instructorName));
      navigate(`/live/${curriculumName}`, {
        state: {
          curriculumId,
        },
      });
    } catch (error) {
      alert('방 참여에 실패했습니다.');
    }
  };

  return (
    <div className="group relative">
      <button onClick={() => handleJoinLive()} className="w-full">
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
          {/* LIVE 뱃지 */}
          <div className="absolute left-3 top-3 z-20">
            <div className="flex items-center gap-1.5 rounded-md bg-black/70 px-2 py-1 text-sm font-bold text-white">
              <div className="animate-pulse">
                <div className="h-2 w-2 rounded-full bg-red-500" />
              </div>
              <span>LIVE</span>
            </div>
          </div>

          {/* 썸네일 이미지 */}
          <img
            src={image || posterNoneImg}
            alt="poster"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />

          {/* 호버 시 오버레이 */}
          <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        </div>

        {/* 방송 정보 */}
        <div className="mt-3 text-left">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/lecture/${lectureId}`);
            }}
            className="active:text-primary-hover-color text-base font-bold text-gray-900 transition-all duration-300 hover:text-primary-color hover:underline"
          >
            <h4 className="text-base font-medium">{curriculumName}</h4>
          </button>
          <div className="mt-1 flex items-center gap-2">
            {instructorName}
            <div className="flex flex-wrap gap-1.5">
              {hashtags?.map((tag, index) => (
                <div
                  key={index}
                  className="inline-block rounded-full border bg-bg-gray-color px-3 py-1"
                >
                  <p className="text-text-gray-color">{tag}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};
