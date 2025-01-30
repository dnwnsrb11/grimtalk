// 강의 다시보기 버튼
import { ReplayLecturePlayButton } from '@/components/lecture/replay/ReplayLecturePlayButton';
// 이미지 유사도 확인 버튼
import { ReplayLectuecheckImageSimilarityButton } from '@/components/lecture/replay/ReplayLectuecheckImageSimilarityButton';

export const ReplayLectureCard = () => {
  const testText =
    '선거운동은 각급 선거관리위원회의 관리하에 법률이 정하는 범위안에서 하되, 균등한 기회가 보장되어야 한다. 농업생산성의 제고와 농지의 합리적인 이용을 위하거나 불가피한 사정으로 발생하는 농지의 임대차와 위탁경영은 법률이 정하는 바에 의하여 인정된다. 감사원의 조직·직무범위·감사위원의 자격·감사대상공무원의 범위 기타 필요한 사항은 법률로 정한다. 국가는 국민 모두의 생산 및 생활의 기반이 되는 국토의 효율적이고 균형있는 이용·개발과 보전을 위하여 법률이 정하는 바에 의하여 그에 관한 필요한 제한과 의무를 과할 수 있다. 국가는 농·어민과 중소기업의 자조조직을 육성하여야 하며, 그 자율적 활동과 발전을 보장한다. 의원을 제명하려면 국회재적의원 3분의 2 이상의 찬성이 있어야 한다. 국민경제자문회의의 조직·직무범위 기타 필요한 사항은 법률로 정한다. 군인·군무원·경찰공무원 기타 법률이 정하는 자가 전투·훈련등 직무집행과 관련하여 받은 손해에 대하여는 법률이 정하는 보상외에 국가 또는 공공단체에 공무원의 직무상 불법행위로 인한 배상은 청구할 수 없다.';

  return (
    <>
      <div className="flex w-full rounded-2xl border border-gray-border-color bg-bg-gray-color p-[20px]">
        <div className="w-[80%]">
          {/* 왼쪽 */}
          <div>
            <div>
              <h1 className="text-[22px] font-semibold text-text-gray-color">
                커리큘럼 1. 진짜 시작
              </h1>
              <p className="mt-[15px] line-clamp-2 text-text-gray-color">{testText}</p>
            </div>
            <div className="mt-[15px] flex gap-3">
              {/* 하단 정보 */}
              <div className="rounded-full bg-black px-[10px] py-[5px] ">
                <p className="text-[14px] font-semibold text-white">수업완료</p>
              </div>
              <div className="rounded-full bg-black px-[10px] py-[5px] ">
                <p className="text-[14px] font-semibold text-white">2025.03.01</p>
              </div>
            </div>
          </div>
        </div>
        <div className="ml-[25px] w-[20%] border-l border-gray-border-color">
          {/* 오른쪽 */}
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-[40px]">
            <ReplayLecturePlayButton isActive={true} />
            <ReplayLectuecheckImageSimilarityButton />
          </div>
        </div>
      </div>
    </>
  );
};
