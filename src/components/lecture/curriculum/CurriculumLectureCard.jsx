import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/store/useAuthStore';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { formatDateWithTime } from '@/utils/dateFormatter';

export const CurriculumLectureCard = ({ curriculum, instructorId, instructorNickname }) => {
  const navigate = useNavigate();
  const { id, nickname } = useAuthStore((state) => state.userData);
  const checkFavorite = useFavoriteStore((state) => state.checkFavorite);
  const isInstructor = id === instructorId;

  const handleJoinLive = () => {
    if (!id) {
      toast.error('로그인 후 이용해주세요.');
      navigate('/login');
      return;
    }

    if (isInstructor) {
      // 강사인 경우 createRoom 로직
      localStorage.setItem('roomCreator', instructorNickname);
      navigate(`/live/${curriculum.subject}`, {
        state: {
          curriculumId: curriculum.curriculumId,
          curriculumSubject: curriculum.subject,
          userId: id,
          userNickname: nickname,
        },
      });
    } else {
      // 학생인 경우 즐겨찾기 확인 후 joinRoom 로직
      if (!checkFavorite) {
        toast('즐겨찾기 후 라이브에 참여할 수 있습니다.', {
          icon: '💡',
        });
        navigate(`/lecture/${curriculum.lectureId}`);
        return;
      }

      localStorage.setItem('roomCreator', instructorNickname);
      navigate(`/live/${curriculum.subject}`, {
        state: {
          curriculumId: curriculum.curriculumId,
          curriculumSubject: curriculum.subject,
          userId: id,
          userNickname: nickname,
        },
      });
    }
  };

  // 카드의 기본 스타일을 상태에 따라 결정
  const cardBaseStyle = curriculum.status
    ? 'rounded-2xl border border-gray-300 bg-gray-100 p-[20px]' // 완료된 상태
    : curriculum.live
      ? 'rounded-2xl bg-white p-[20px] relative transition-all before:duration-1000 before:absolute before:inset-0 before:rounded-2xl before:border-2 before:border-primary-color before:animate-pulse before:pointer-events-none' // 라이브 중
      : 'rounded-2xl border border-gray-border-color bg-white p-[20px]'; // 예정된 상태

  return (
    <>
      <div className={cardBaseStyle}>
        <div>
          {/* 제목 및 내용 */}
          <h1
            className={`text-[22px] font-semibold ${
              curriculum.status ? 'text-gray-500' : curriculum.live ? 'text-common-font-color' : ''
            }`}
          >
            {curriculum.subject}
          </h1>
          <div className="mt-[15px] w-[100%]">
            <p
              className={`w-[85%] ${
                curriculum.status
                  ? 'text-gray-500'
                  : curriculum.live
                    ? 'text-common-font-color'
                    : ''
              } whitespace-pre-line`}
            >
              {curriculum.content}
            </p>
          </div>
        </div>
        <div className="mt-[15px] flex items-center justify-between">
          <div className="flex gap-3">
            {/* 하단 정보  */}
            <div
              className={`rounded-full border px-[10px] py-[5px] ${
                curriculum.status
                  ? 'border-gray-300 bg-gray-200 text-gray-500'
                  : curriculum.live
                    ? 'border-primary-color bg-primary-color text-white'
                    : 'bg-bg-gray-color'
              }`}
            >
              <p className="text-[16px] font-semibold">
                {curriculum.status
                  ? '수업완료'
                  : curriculum.live
                    ? isInstructor
                      ? '수업 중'
                      : '수업 중'
                    : '수업예정'}
              </p>
            </div>
            {!curriculum.status && (
              <div
                className={`rounded-full px-[10px] py-[5px] ${
                  curriculum.live ? 'bg-primary-color text-white' : 'bg-primary-color text-white'
                }`}
              >
                <p className="text-[16px] font-semibold">
                  {formatDateWithTime(curriculum.expectedLiveTime)}
                </p>
              </div>
            )}
          </div>
          {curriculum.status ? (
            <div className="rounded-full border border-gray-300 bg-gray-200 px-6 py-2 text-[16px] font-semibold text-gray-500">
              라이브 종료
            </div>
          ) : curriculum.live ? (
            <button
              onClick={handleJoinLive}
              className="hover:bg-primary-hover-color relative animate-pulse overflow-hidden rounded-full border-2 border-primary-color bg-primary-color px-6 py-2 text-[16px] font-semibold text-white transition-all duration-1000  hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-color focus:ring-offset-2"
            >
              {/* 반짝이는 효과 오버레이 */}
              라이브 입장
            </button>
          ) : isInstructor ? (
            <button
              onClick={handleJoinLive}
              className="hover:bg-primary-hover-color rounded-full border-2 border-primary-color bg-primary-color px-6 py-2 text-[16px] font-semibold text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-color focus:ring-offset-2"
            >
              라이브 시작
            </button>
          ) : (
            <div className="rounded-full border border-gray-300 bg-gray-100 px-6 py-2 text-[16px] font-semibold text-gray-500">
              라이브 예정
            </div>
          )}
        </div>
      </div>
    </>
  );
};
