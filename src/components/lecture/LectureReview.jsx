import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { _axios, _axiosAuth } from '@/api/instance';
import { StarReviewIcon } from '@/components/common/icons';
import { LoadingComponents } from '@/components/common/LoadingComponents';
import { ReviewLectureCard } from '@/components/lecture/review/ReviewLectureCard';

export const LectureReview = ({ lecture }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  // 리뷰 리스트 받아오기
  const {
    data: reviews,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const { data } = await _axios.get(`/review/${lecture.lectureId}`);
      return data.body.data.list;
    },
    onError: () => {
      navigate('/notfound');
    },
  });
  const [score, setScore] = useState(0);
  //  1에서 다시 클릭하면 값이 0으로 변경되게
  const checkScore = (index, score) => {
    if (index === score - 1) {
      setScore(0);
    } else {
      setScore(index + 1);
    }
  };

  const [reviewText, setReviewText] = useState('');
  // 강의 작성 로직
  const addReviewMutaion = useMutation({
    mutationFn: async () => {
      const { data } = _axiosAuth.post('/review', {
        lectureId: lecture.lectureId,
        content: reviewText,
        star: score,
      });
      return data;
    },
    onSuccess: () => {
      alert('리뷰 작성 완료');
      queryClient.invalidateQueries(['reviews']);
    },
  });
  if (isLoading) {
    return <LoadingComponents />;
  }
  return (
    <>
      <div className="mt-[60px]">
        <div>
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
                className={`text-[22px] text-[#828282] transition-all duration-500 ease-in-out ${score === 0 ? 'opacity-50' : `opacity-100`}`}
              >
                <span
                  className={`font-semibold ${score === 0 ? 'text-text-gray-color' : 'text-primary-color'}`}
                >
                  {score}
                </span>
                / 5
              </p>
            </div>
          </div>
          <div className="mt-[25px]">
            <textarea
              name=""
              id=""
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="강의에 대한 리뷰를 알려주세요~!"
              className="min-h-[200px] w-full resize-none rounded-2xl border border-gray-border-color p-5 transition-all duration-200 focus:border-primary-color focus:outline-none"
            ></textarea>
            <div className="mt-[10px] flex justify-end">
              <button
                className="rounded-2xl bg-primary-color px-[30px] py-[10px]"
                onClick={() => addReviewMutaion.mutate()}
              >
                <p className="text-[18px] font-semibold text-white">리뷰 작성하기</p>
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="mt-[40px]">
            <h1 className="text-[32px] font-bold">전체 리뷰</h1>
            <div className="mt-[10px] grid grid-cols-4 gap-3">
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
