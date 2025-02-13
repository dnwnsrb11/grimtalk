import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { _axiosAuth } from '@/api/instance';
import starSVG from '@/assets/banner/star.svg';
import posterNoneImg from '@/assets/posterNoneImg.png';

export const Lecture = ({ lecture, showStar = true, showUpdate = false }) => {
  const lectureSubject = lecture.subject;
  const lectureNickname = lecture.nickname;
  const lectureTags = lecture.hashtags;
  const lectureCategory = lecture.category ?? null;
  const lectureStar = lecture.start || 0;
  const lectureImg = lecture.image || posterNoneImg;
  const lectureId = lecture.lectureId || null; // 🔥 강의 ID 추가
  const navigate = useNavigate();

  const handleImageError = (e) => {
    e.target.src = posterNoneImg;
  };

  // ✅ DELETE 요청을 위한 useMutation 정의
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { data } = await _axiosAuth.delete(`/lecture/${lectureId}`);
      console.log(lectureId);
      return data;
    },
    onSuccess: () => {
      console.log(`${lectureSubject} 강의가 삭제되었습니다.`);
      queryClient.invalidateQueries(['lectures']); // ✅ 삭제 후 강의 목록 갱신
    },
    onError: (error) => {
      console.error('삭제 실패:', error);
    },
  });

  const handleDelete = () => {
    const isConfirmed = window.confirm(`정말 '${lectureSubject}' 강의를 삭제하시겠습니까?`);
    if (isConfirmed) {
      deleteMutation.mutate();
    }
  };

  return (
    <div className="group cursor-pointer">
      <div
        onClick={() => {
          console.log('클릭');
          navigate(`/lecture/${lectureId}`);
        }}
      >
        <div className="min-h-[160px] overflow-hidden rounded-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
          <img
            src={lectureImg}
            alt={lectureSubject}
            className="h-full w-full object-cover"
            onError={handleImageError}
          />
        </div>

        <div>
          <h4 className="mt-2 text-lg leading-tight">{lectureSubject}</h4>
          <div className="mt-2 flex items-center gap-3">
            <h4 className="text-base font-bold">{lectureNickname || ''}</h4>
            <div className="flex gap-1">
              {lectureTags?.map((tag, index) => (
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
      </div>
      {showStar && (
        <div className="mt-2 flex items-center gap-2">
          <div>
            <img src={starSVG} alt="starIcon" />
          </div>
          <p className="text-text-gray-color">{lectureStar} / 5</p>
        </div>
      )}

      {showUpdate && (
        <button
          onClick={handleDelete}
          className="mt-[10px] h-[41px] w-[88px] rounded-2xl border border-solid bg-[#EFEFEF] text-[18px] transition-all duration-200 hover:bg-red-50 hover:shadow-md"
        >
          삭제하기
        </button>
      )}
    </div>
  );
};
