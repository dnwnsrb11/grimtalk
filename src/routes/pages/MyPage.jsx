import defaultBadge from '@/assets/defaultBadge.svg';
import instructorBadge from '@/assets/instructorBadge.svg';
import studentBadge from '@/assets/studentBadge.svg';

export const MyPage = () => {
  return (
    <div className="grid w-full grid-cols-10">
      {/* 왼쪽 사이드바 - 프로필 섹션 */}
      <div className="col-span-2 flex flex-col items-center border-r border-gray-200 pr-3">
        {/* 프로필 정보 컨테이너 */}
        <div className="flex flex-col items-start gap-5">
          {/* 프로필 이미지, 이름, 역할 버튼 */}
          <div className="flex flex-col items-center gap-1">
            {/* 프로필 이미지 */}
            <div className="h-24 w-24 rounded-full bg-gray-600"></div>
            {/* 사용자 이름 */}
            <div className="flex items-center gap-1">
              <img src={defaultBadge} alt="defaultBadge" />
              <span className="text-2xl font-bold">Woojungyu</span>
            </div>
            {/* 역할 선택 버튼 */}
            <div className="mt-2 flex gap-3 text-lg font-semibold">
              <button className="flex items-center gap-1 rounded-lg border bg-bg-gray-color px-3 py-1">
                <img src={studentBadge} alt="studentBadge" />
                수강생
              </button>
              <button className="flex items-center gap-1 rounded-lg bg-primary-color px-3 py-1 text-white">
                <img src={instructorBadge} alt="instructorBadge" />
                강사
              </button>
            </div>
          </div>

          {/* 네비게이션 메뉴 */}
          <div className="flex flex-col items-baseline gap-3 text-xl">
            <button>유저소개</button>
            <button>대시보드</button>
            <button>마이 페이지</button>
            <button>내가 쓴 글</button>
            <button>구독, 즐겨찾기</button>
          </div>
        </div>
      </div>

      {/* 오른쪽 메인 컨텐츠 영역 */}
      <div className="col-span-8 flex flex-col gap-3 pl-6">
        {/* 페이지 제목 */}
        <div className="text-2xl font-bold">구독, 즐겨찾기</div>
        <hr className="w-full" />
        {/* 구독/즐겨찾기 토글 버튼 */}
        <div className="flex gap-3">
          <button className="rounded bg-primary-color px-3 py-1 text-white">구독</button>
          <button className="rounded bg-bg-gray-color px-3 py-1 font-bold text-gray-700">
            즐겨찾기
          </button>
        </div>

        {/* 구독/즐겨찾기 항목 카드 */}
        <div className="flex flex-row items-center rounded-xl border border-gray-border-color p-4">
          {/* 프로필 이미지 */}
          <div className="h-24 w-24 rounded-full bg-bg-gray-color"></div>
          {/* 프로필 정보 */}
          <div className="flex flex-col gap-1 p-4">
            <p className="text-lg font-bold">김싸피</p>
            {/* 태그 목록 */}
            <div className="flex flex-row gap-1">
              <span className="rounded-3xl bg-bg-gray-color px-2 py-0.5 text-base text-detail-text-color">
                열정 있는
              </span>
              <span className="rounded-3xl bg-bg-gray-color px-2 py-0.5 text-base text-detail-text-color">
                배우기 쉬운
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
