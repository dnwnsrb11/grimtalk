import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { _axios, _axiosAuth } from '@/api/instance';
import { StarReviewIcon } from '@/components/common/icons';
import { LoadingComponents } from '@/components/common/LoadingComponents';
import { ReviewLectureCard } from '@/components/lecture/review/ReviewLectureCard';
import { useAuthStore } from '@/store/useAuthStore';

export const LectureReview = ({ lecture, checkInstructor }) => {
  const { id } = useAuthStore((state) => state.userData);
  const queryClient = useQueryClient();
  const MAX_LENGTH = 255;
  const navigate = useNavigate();

  // 리뷰 리스트 받아오기
  const {
    data: reviews,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const { data } = await _axios.get(`/review/${lecture.lectureId}`);
      return data.body.data.list;
    },
    staleTime: 0,
    onError: () => {
      navigate('/notfound');
    },
  });
  console.log(checkInstructor);
  const [score, setScore] = useState(0);
  const [reviewText, setReviewText] = useState('');

  // ⭐ 1에서 다시 클릭하면 값이 0으로 변경되게 설정
  const checkScore = (index, score) => {
    if (index === score - 1) {
      setScore(0);
    } else {
      setScore(index + 1);
    }
  };

  // ✅ 입력 제한 체크 (toast 추가)
  const handleReviewChange = (e) => {
    if (e.target.value.length > MAX_LENGTH) {
      toast.error(`최대 ${MAX_LENGTH}자까지만 입력할 수 있습니다.`);
      return;
    }
    setReviewText(e.target.value);
  };

  // 강의 리뷰 작성 로직
  const addReviewMutation = useMutation({
    mutationFn: async () => {
      const { data } = await _axiosAuth.post('/review', {
        lectureId: lecture.lectureId,
        content: reviewText,
        star: score,
      });
      if (data.body?.code && data.body.code !== 200) {
        throw { response: { data } };
      }
      return data;
    },
    onSuccess: () => {
      alert('리뷰 작성 완료!');
      setReviewText('');
      queryClient.invalidateQueries(['reviews']);
    },
    onError: (error) => {
      const errorCode = error.response.data.body.code;
      if ([5006, 5001, 5003].includes(errorCode)) {
        navigate('/login');
      } else {
        toast.error('네트워크 오류 발생');
      }
    },
  });

  if (isLoading) {
    return <LoadingComponents />;
  }

  return (
    <>
      <div className="mt-[60px]">
        <div>
          {!checkInstructor && (
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  onClick={() => checkScore(index, score)}
                  className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-125"
                >
                  {index < score ? (
                    <StarReviewIcon />
                  ) : (
                    <StarReviewIcon fill="#DBDBDB" stroke="#DBDBDB" />
                  )}
                </div>
              ))}
              <div className="ml-[15px]">
                <p
                  className={`text-[22px] text-[#828282] transition-all duration-500 ease-in-out ${
                    score === 0 ? 'opacity-50' : 'opacity-100'
                  }`}
                >
                  <span
                    className={`font-semibold ${
                      score === 0 ? 'text-text-gray-color' : 'text-primary-color'
                    }`}
                  >
                    {score}
                  </span>
                  / 5
                </p>
              </div>
            </div>
          )}
          <div className="mt-[25px]">
            <textarea
              value={reviewText}
              onChange={handleReviewChange}
              placeholder="강의에 대한 리뷰를 알려주세요~!"
              className="min-h-[200px] w-full resize-none rounded-2xl border border-gray-border-color p-5 transition-all duration-200 focus:border-primary-color focus:outline-none"
              maxLength={MAX_LENGTH}
              disabled={checkInstructor} // ✅ 강사가 맞으면 입력 비활성화
            ></textarea>
            <small>
              {reviewText.length} / {MAX_LENGTH}
            </small>
            {!checkInstructor && ( // ✅ 강사가 아닐 때만 버튼 표시
              <div className="mt-[10px] flex justify-end">
                <button
                  className="rounded-2xl bg-primary-color px-[30px] py-[10px]"
                  onClick={() => {
                    if (!id) {
                      navigate('/login');
                      toast.error('로그인 후 이용해주세요.');
                      return;
                    }
                    addReviewMutation.mutate();
                  }}
                >
                  <p className="text-[18px] font-semibold text-white">리뷰 작성하기</p>
                </button>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="mt-[40px]">
            <h1 className="text-[32px] font-bold">전체 리뷰</h1>
            <div className="mt-[10px] grid grid-cols-3 gap-3">
              {reviews.map((review, index) => (
                <div key={index}>
                  <ReviewLectureCard review={review} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
