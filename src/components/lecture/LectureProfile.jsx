import badge from '@/assets/Group_825.png';
import subscribe from '@/assets/Group.png';
export const LectureProfile = () => {
  const testtext =
    '사회적 특수계급의 제도는 인정되지 아니하며, 어떠한 형태로도 이를 창설할 수 없다. 대법원과 각급법원의 조직은 법률로 정한다. 누구든지 체포 또는 구속을 당한 때에는 즉시 변호인의 조력을 받을 권리를 가진다. 다만, 형사피고인이 스스로 변호인을 구할 수 없을 때에는 법률이 정하는 바에 의하여 국가가 변호인을 붙인다.';

  return (
    <>
      <div>
        <div>
          <h2>간단한 드로잉을 통한 이모티콘 만들기!</h2>
        </div>
        {/* 강의 프로필 카드 구역 */}
        <div>
          <div className="flex items-center gap-[40px] rounded-3xl border border-gray-border-color px-[40px] py-[22px]">
            <div>
              {/* 프로필 이미지 */}
              <div className="relative h-[162px] w-[162px] rounded-full bg-[#565252]">
                <div className="absolute bottom-0 right-0 flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full bg-disabled-font-color">
                  {/* 뱃지 */}
                  <img src={badge} alt="badgeIMG" />
                </div>
              </div>
            </div>
            <div>
              {/* 강사 인포 */}
              <div>
                <h2 className="mb-[15px] text-[24px] font-bold">WoojunGyu</h2>
                <p> {testtext} </p>
              </div>
              <div className="mt-[15px] flex gap-3">
                {/* 버튼 */}
                <button className="rounded-xl border bg-bg-gray-color p-2 px-3 font-semibold transition-all duration-300 hover:bg-primary-color hover:text-white">
                  자세히 보기
                </button>
                <button className="flex items-center gap-2 rounded-xl border bg-bg-gray-color p-2 px-3 font-semibold transition-all duration-300 hover:bg-primary-color hover:text-white">
                  <img src={subscribe} alt="subscribeIMG" />
                  구독
                </button>
              </div>
            </div>
          </div>
          <div>{/* 프로필 왼쪽 구역 */}</div>
        </div>
      </div>
    </>
  );
};
