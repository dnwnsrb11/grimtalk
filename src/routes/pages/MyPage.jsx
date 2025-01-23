export const MyPage = () => {
  return (
    <div className="grid w-full grid-cols-10">
      {/* 프로필 섹션 */}
      <div className="col-span-2 flex flex-col items-center border-r border-gray-200 pr-3">
        <div className="flex flex-col items-start gap-5">
          <div className="flex flex-col items-center gap-1">
            <div className="h-24 w-24 rounded-full bg-gray-600"></div>
            <div className="flex items-center">
              <span className="text-2xl font-bold">Woojungyu</span>
            </div>
            <div className="mt-2 flex gap-3 text-lg font-semibold">
              <button className="flex items-center rounded-lg border bg-bg-gray-color px-3 py-1">
                수강생
              </button>
              <button className="flex items-center rounded-lg bg-primary-color px-3 py-1 text-white">
                강사
              </button>
            </div>
          </div>

          <div className="flex flex-col items-baseline gap-3 text-xl">
            <button>유저소개</button>
            <button>대시보드</button>
            <button>마이 페이지</button>
            <button>내가 쓴 글</button>
            <button>구독, 즐겨찾기</button>
          </div>
        </div>
      </div>

      <div className="col-span-8 flex flex-col gap-3 pl-6">
        <div className="text-2xl font-bold">구독, 즐겨찾기</div>
        <hr className="w-full" />
        <div className="flex gap-3">
          <button className="rounded bg-primary-color px-3 py-1 text-white">구독</button>
          <button className="rounded bg-bg-gray-color px-3 py-1 font-bold text-gray-700">
            즐겨찾기
          </button>
        </div>

        <div className="flex flex-row items-center rounded-xl border border-gray-border-color p-4">
          <div className="h-24 w-24 rounded-full bg-bg-gray-color"></div>
          <div className="flex flex-col gap-1 p-4">
            <p className="text-lg font-bold">김싸피</p>
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
