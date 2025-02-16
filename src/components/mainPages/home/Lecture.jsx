import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { _axiosAuth } from '@/api/instance';
import starSVG from '@/assets/banner/star.svg';
import posterNoneImg from '@/assets/posterNoneImg.png';

export const Lecture = ({ lecture, showStar = true, showUpdate = false }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 🔹 글자 수 제한 함수
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  // 🔹 데이터 정리
  const lectureSubject = truncateText(lecture.subject, 13);
  const lectureNickname = truncateText(lecture.nickname, 5);
  const lectureTags = lecture.hashtags?.slice(0, 3).map((tag) => truncateText(tag, 2));
  const lectureCategory = lecture.category ?? null;
  const lectureStar = lecture.star || 0;
  const lectureImg = lecture.image || posterNoneImg;
  const lectureId = lecture.lectureId || null;

  const handleImageError = (e) => {
    e.target.src = posterNoneImg;
  };

  // ✅ DELETE 요청을 위한 useMutation 정의
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { data } = await _axiosAuth.delete(`/lecture/${lectureId}`);
      return data;
    },
    onSuccess: () => {
      console.log(`${lectureSubject} 강의가 삭제되었습니다.`);
      queryClient.invalidateQueries(['lectures']); // ✅ 삭제 후 목록 갱신
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
    <div className="w-full">
      <div>
        <div onClick={() => navigate(`/lecture/${lectureId}`)}>
          {/* 🔹 이미지 크기 통일 */}
          <div className="max-h-[175px] min-h-[175px] w-full overflow-hidden rounded-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <img
              src={lectureImg}
              alt={lectureSubject}
              className="h-full max-h-[175px] min-h-[175px] w-full object-contain"
              onError={handleImageError}
            />
          </div>

          <div className="max-w-[300px]">
            <div className="flex flex-row justify-between">
              <h4 className="mt-2 text-lg leading-tight">{lectureSubject}</h4>
              {lectureCategory && (
                <div className="inline-block rounded-full border px-3 py-1">
                  <p className="text-text-gray-color">{lectureCategory}</p>
                </div>
              )}
            </div>

            <div className="mt-2 flex items-center gap-3">
              <h4 className="text-base font-bold">{lectureNickname}</h4>
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
          <div className="absolute right-2 top-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              onClick={handleDelete}
              className="h-[36px] w-[80px] rounded-lg border bg-primary-color text-sm text-white transition-all duration-300 hover:opacity-80 hover:shadow-md"
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
