import { useMutation, useQueryClient } from '@tanstack/react-query';

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
  console.log(lecture);
  const handleImageError = (e) => {
    e.target.src = posterNoneImg;
  };

  // ✅ DELETE 요청을 위한 useMutation 정의
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { data } = await _axiosAuth.delete(`/lecture/${lectureId}`);
      return data;
    },
    onSuccess: () => {
      console.log(`${lectureSubject} 강의가 삭제되었습니다.`);
      // 필요하면 상태 업데이트 or refetch 호출 가능
      queryClient.invalidateQueries(['lectures']);
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
    <div className={`${!showStar ? 'mb-8' : ''}`}>
      <div className="min-h-[160px] overflow-hidden rounded-lg">
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
          <h4 className="text-base font-bold">{lectureNickname || '뭐임?'}</h4>
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

      {/* ✅ showStar가 true 일 때만 표시 */}
      {showStar && (
        <div className="mt-2 flex items-center gap-2">
          <div>
            <img src={starSVG} alt="starIcon" />
          </div>
          <p className="text-text-gray-color">{lectureStar} / 5</p>
        </div>
      )}

      {/* ✅ showUpdate가 true일 때만 삭제 버튼 표시 */}
      {showUpdate && (
        <button
          onClick={handleDelete} // 🔥 mutate 호출
          className="mt-[10px] h-[41px] w-[88px] rounded-2xl border-[1px] border-solid bg-[#EFEFEF] text-[18px]"
        >
          삭제하기
        </button>
      )}
    </div>
  );
};
