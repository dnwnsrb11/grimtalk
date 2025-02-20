import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { _axiosAuth } from '@/api/instance';
// nonImage 가져오기
import nonImage from '@/assets/nonProfile.png';
// 아이콘 가져오기
import {
  CharacterIcon,
  ColoringIcon,
  ConceptArtIcon,
  DrawingIcon,
  EmoticonIcon,
  FavoriteIcon,
  LeveloneBadgeIcon,
  LevelthirdBadgeIcon,
  LeveltwoBadgeIcon,
  SubscribeIcon,
  WebtoonIcon,
} from '@/components/common/icons';
import { LiveClock } from '@/components/lecture/LiveClock';
import { HashTagChip } from '@/components/mypage/HashTagChip';
import { useAuthStore } from '@/store/useAuthStore';
import { useFavoriteStore } from '@/store/useFavoriteStore';

export const LectureProfile = ({ checkInstructor, lecture, setSelectedCategory }) => {
  const { id, email, nickname } = useAuthStore((state) => state.userData);
  const { checkFavorite, setCheckFavorite } = useFavoriteStore();
  const navigate = useNavigate();
  //   구독시 값에 따라 버튼 활성화, 비활성화 기능 구현
  const [checkSubscribe, setCheckSubscribe] = useState(false);

  // 강의 즐겨찾기 추가
  const lectureFavorite = useMutation({
    mutationFn: async () => {
      const { data } = await _axiosAuth.post(`/favorite`, { lectureId: lecture?.lectureId });
      return data;
    },
    onSuccess: () => {
      toast.success('즐겨찾기가 추가되었습니다.'); // ✅ 성공 알림 추가
      setCheckFavorite(true);
    },
    onError: (error) => {
      alert('즐겨찾기 추가 실패'); // ❌ 실패 알림 추가
    },
  });
  // 강의 즐겨찾기 취소
  const lectureFavoriteCancel = useMutation({
    mutationFn: async () => {
      const { data } = await _axiosAuth.delete(`/favorite/${lecture?.lectureId}`);
      return data;
    },
    onSuccess: () => {
      toast.success('즐겨찾기가 삭제되었습니다.'); // ✅ 성공 알림 추가
      setCheckFavorite(false);
    },
    onError: (error) => {
      alert('즐겨찾기 삭제 실패'); // ❌ 실패 알림 추가
    },
  });

  // 즐겨찾기 추가/삭제
  const favoriteSubmit = async () => {
    if (!checkFavorite) {
      lectureFavorite.mutate();
    } else {
      lectureFavoriteCancel.mutate();
    }
  };

  // 강사 구독 추가
  const lectureSubmit = useMutation({
    mutationFn: async () => {
      const { data } = await _axiosAuth.post(`/subscribe`, {
        memberId: lecture?.instructorInfo?.id,
      });
      return data;
    },
    onSuccess: () => {
      toast.success('강사 구독이 추가되었습니다.');
      setCheckSubscribe(true);
    },
    onError: (error) => {
      alert('강사 구독 추가 실패');
    },
  });

  // 강사 구독 취소
  const lectureSubmitCancel = useMutation({
    mutationFn: async () => {
      const { data } = await _axiosAuth.delete(`/subscribe/${lecture?.instructorInfo?.id}`);
      return data;
    },
    onSuccess: () => {
      toast.success('강사 구독이 취소되었습니다.');
      setCheckSubscribe(false);
    },
    onError: (error) => {
      alert('강사 구독 취소 실패');
    },
  });

  const subscribeSubmit = async () => {
    if (!checkSubscribe) {
      lectureSubmit.mutate();
      setCheckSubscribe(true);
    } else {
      lectureSubmitCancel.mutate();
      setCheckSubscribe(false);
    }
  };
  // console.log('targetid:', lecture?.instructorInfo?.id);
  // console.log('myid:', id);
  const { data: check } = useQuery({
    queryKey: ['check'],
    queryFn: async () => {
      const { data } = await _axiosAuth.get(`/subscribe`);
      return data.body?.data ?? []; // ❗ 항상 배열을 반환하도록 처리
    },
    staleTime: 0,
  });

  useEffect(() => {
    if (!check || check.length === 0) return; // check가 없거나 빈 배열이면 실행 X

    // check 배열을 돌면서 lecture.instructorInfo.id와 비교
    const isMatched = check.some((item) => {
      return item.memberId === lecture?.instructorInfo?.id; // 올바르게 return 추가
    });

    if (isMatched) {
      setCheckSubscribe(true);
    } else {
      setCheckSubscribe(false);
    }
  }, [check, lecture?.instructorInfo?.id]); // check 또는 instructor ID가 변경될 때 실행

  const { data: checkF } = useQuery({
    queryKey: ['favorite'],
    queryFn: async () => {
      const { data } = await _axiosAuth.get(`/favorite`);
      return data.body?.data ?? []; // ❗ 항상 배열 반환
    },
    staleTime: 0,
  });

  useEffect(() => {
    if (!checkF || !checkF.list || checkF.list.length === 0) return;
    const isMatched = checkF.list.some((item) => {
      return item.lectureId === lecture?.lectureId;
    });

    setCheckFavorite(isMatched);
  }, [checkF, lecture?.lectureId, setCheckFavorite]);

  return (
    <>
      <div>
        <div className="mb-[20px] mt-[60px] flex flex-row justify-between">
          <div>
            <h2 className="text-[32px] font-bold">{lecture?.subject}</h2>
            <span className="flex gap-3">
              {lecture ? (
                lecture?.hashtags?.map((tag, index) => (
                  <HashTagChip key={index} hashTag={`#${tag}`} />
                ))
              ) : (
                <div>태그가 없습니다.</div>
              )}
            </span>
          </div>
          <div className="flex items-end">
            <div className=" flex items-center gap-2 rounded-full border bg-primary-color px-3 py-1">
              {lecture?.category === '웹툰' && <WebtoonIcon className="h-5 w-5" fill="white" />}
              {lecture?.category === '이모티콘' && (
                <EmoticonIcon className="h-5 w-5" fill="white" />
              )}
              {lecture?.category === '캐릭터' && <CharacterIcon className="h-5 w-5" fill="white" />}
              {lecture?.category === '드로잉' && <DrawingIcon className="h-5 w-5" fill="white" />}
              {lecture?.category === '컬러링' && <ColoringIcon className="h-5 w-5" fill="white" />}
              {lecture?.category === '컨셉 아트' && (
                <ConceptArtIcon className="h-5 w-5" fill="white" />
              )}
              <p className="text-white">{lecture?.category}</p>
            </div>
          </div>
        </div>
        {/* 강의 프로필 카드 구역 */}
        <div className="flex h-full gap-5">
          <div className="flex h-full w-[80%] items-center gap-[40px] rounded-3xl border border-gray-border-color px-[40px] py-[22px]">
            <div>
              {/* 프로필 이미지 */}
              <div className="relative h-[162px] w-[162px] rounded-full bg-white">
                {/*  현재 기본 이미지로 되어 잇는데 추후 값에 따라 다르게 렌더링 되게 변경 하기  */}
                <div className="overflow-hidden rounded-full">
                  <img
                    src={lecture?.instructorInfo?.image || nonImage}
                    alt="profileimg"
                    className="h-[162px] w-[162px]"
                  />
                </div>
                {lecture?.instructorInfo?.subscribeNumber >= 3 && (
                  <div className="absolute bottom-0 right-0 flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full bg-disabled-font-color">
                    {/* 뱃지 svg로 초기화 */}
                    {/* {lecture?.instructorInfo?.subscribeNumber <= 10 ? (
                    <LeveloneBadgeIcon />
                  ) : lecture?.instructorInfo?.subscribeNumber <= 100 ? (
                    <LeveltwoBadgeIcon />
                  ) : lecture?.instructorInfo?.subscribeNumber >= 101 ? (
                    <LevelthirdBadgeIcon />
                  ) : null} */}
                    {lecture?.instructorInfo?.subscribeNumber >= 101 ? (
                      <LevelthirdBadgeIcon />
                    ) : lecture?.instructorInfo?.subscribeNumber >= 10 ? (
                      <LeveltwoBadgeIcon />
                    ) : lecture?.instructorInfo?.subscribeNumber >= 3 ? (
                      <LeveloneBadgeIcon />
                    ) : null}
                  </div>
                )}
              </div>
            </div>
            <div>
              {/* 강사 인포 */}
              <div>
                <h2 className="mb-[15px] text-[24px] font-bold">
                  {lecture?.instructorInfo?.nickname}
                </h2>
                {lecture?.instructorInfo?.intro === null ? (
                  <p className="font-medium text-text-gray-color">작성된 소개 메시지가 없습니다.</p>
                ) : (
                  <p className="whitespace-pre-line">
                    {lecture?.instructorInfo?.intro
                      ? lecture.instructorInfo.intro.length > 100
                        ? `${lecture.instructorInfo.intro.slice(0, 100)}...`
                        : lecture.instructorInfo.intro
                      : ''}
                  </p>
                )}
              </div>
              <div className="mt-[15px] flex gap-3">
                {/* 버튼 */}
                <button
                  className="rounded-xl border bg-bg-gray-color p-2 px-3 font-semibold transition-all duration-300 hover:bg-primary-color hover:text-white"
                  onClick={() =>
                    navigate(`/mypage/${lecture?.instructorInfo?.id}`, {
                      state: {
                        joinId: lecture?.instructorInfo?.id,
                        selectedMenu: '유저소개',
                        selectedProfileMenu: '강사',
                      },
                    })
                  }
                >
                  자세히 보기
                </button>
                {/* 강사 유무에 따라 아래 버튼을 랜더링 (false 일때 버튼을 보이게한다.) */}
                {!checkInstructor &&
                  (checkSubscribe ? (
                    <button
                      className="group flex items-center gap-2 rounded-xl border bg-primary-color p-2 px-3 font-semibold text-white transition-all duration-300 hover:bg-bg-gray-color hover:text-black"
                      onClick={subscribeSubmit}
                    >
                      <SubscribeIcon
                        className="stroke-white transition-colors duration-0 group-hover:stroke-black"
                        stroke="currentColor"
                      />
                      구독
                    </button>
                  ) : (
                    <button
                      className="group flex items-center gap-2 rounded-xl border bg-bg-gray-color p-2 px-3 font-semibold transition-all duration-300 hover:bg-primary-color hover:text-white"
                      onClick={() => {
                        if (!id) {
                          navigate('/login');
                          toast.error('로그인 후 이용해주세요.');
                          return;
                        }
                        subscribeSubmit;
                      }}
                    >
                      <SubscribeIcon
                        className="stroke-black transition-colors duration-0 group-hover:stroke-white"
                        stroke="currentColor"
                      />
                      구독
                    </button>
                  ))}
              </div>
            </div>
          </div>
          {/* 프로필 오른쪽 구역 */}
          <div className="flex w-[20%] flex-col gap-3">
            {/* 강사 유무에 따라 다른 컴포너트(버튼) 랜더링  */}
            {checkInstructor ? (
              <div className="group items-center justify-center rounded-xl border border-gray-border-color bg-primary-color py-[10px] transition-all duration-300 hover:bg-bg-gray-color">
                <button
                  className="group flex w-[100%] items-center justify-center gap-2 text-white transition-all duration-0 group-hover:text-black"
                  onClick={() =>
                    navigate(`/mypage/${id}`, {
                      state: {
                        joinId: id,
                        selectedMenu: '유저소개',
                        selectedProfileMenu: '강사',
                      },
                    })
                  }
                >
                  <FavoriteIcon
                    className="stroke-white transition-colors duration-0 group-hover:stroke-black"
                    stroke="currentColor"
                  />
                  <p className="text-[16px] font-semibold transition-colors duration-0 group-hover:text-black">
                    마이페이지에서 수정하기
                  </p>
                </button>
              </div>
            ) : // 강의 구독 여부에 따라 다른 버튼이 렌더링
            checkFavorite ? (
              <div className="group items-center justify-center rounded-xl border border-gray-border-color bg-primary-color py-[10px] transition-all duration-300 hover:bg-bg-gray-color">
                <button
                  className="group flex w-[100%] items-center justify-center gap-2 text-white transition-all duration-0 group-hover:text-black"
                  onClick={favoriteSubmit}
                >
                  <FavoriteIcon
                    className="stroke-white transition-colors duration-0 group-hover:stroke-black"
                    stroke="currentColor"
                  />
                  <p className="text-[18px] font-semibold transition-colors duration-0 group-hover:text-black">
                    강의 즐겨찾기 취소
                  </p>
                </button>
              </div>
            ) : (
              <div className="group items-center justify-center rounded-xl border border-gray-border-color bg-bg-gray-color py-[10px] transition-all duration-300 hover:bg-primary-color hover:text-white">
                <button
                  className="flex w-[100%] items-center justify-center gap-2"
                  onClick={() => {
                    if (!id) {
                      navigate('/login');
                      toast.error('로그인 후 이용해주세요.');
                      return;
                    }
                    favoriteSubmit;
                  }}
                >
                  <FavoriteIcon
                    className="stroke-white transition-colors duration-0 group-hover:stroke-white"
                    stroke="currentColor"
                  />
                  <p className="text-[18px] font-semibold">강의 즐겨찾기</p>
                </button>
              </div>
            )}

            <div className="flex h-full w-full flex-col items-center justify-center rounded-3xl border border-gray-border-color">
              {/* 라이브 카드 부분 */}
              <LiveClock />
              <button
                className={
                  'rounded-xl bg-primary-color p-3 px-5 font-semibold text-white transition-all duration-200 hover:px-7'
                }
                onClick={() => setSelectedCategory('커리큘럼')}
              >
                {checkInstructor ? '라이브 시작하기' : '라이브 살펴보기'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
