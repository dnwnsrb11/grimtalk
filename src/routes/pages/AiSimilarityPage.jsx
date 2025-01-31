import { useState } from 'react';

import { AiSimilarityResultPage } from '@/components/aiPages/AiSimilarityResult';
import { DefaultBadgeIcon, SubscribeIcon } from '@/components/common/icons';
export const AiSimilarityPage = () => {
  // 라우터
  // 이미지 렌더링 url 상태 추가
  const [imageSrc, setImageSrc] = useState(null);
  // 비교 결과 또는 표시
  const [showComparison, setShowComparison] = useState(false);
  const testtext =
    '사회적 특수계급의 제도는 인정되지 아니하며, 어떠한 형태로도 이를 창설할 수 없다. 대법원과 각급법원의 조직은 법률로 정한다. 누구든지 체포 또는 구속을 당한 때에는 즉시 변호인의 조력을 받을 권리를 가진다. 다만, 형사피고인이 스스로 변호인을 구할 수 없을 때에는 법률이 정하는 바에 의하여 국가가 변호인을 붙인다.';
  const [checkFavorit, setCheckFavorit] = useState(false);
  //   구독시 값에 따라 버튼 활성화, 비활성화 기능 구현
  const [checkSubscribe, setCheckSubcribe] = useState(false);
  // 파일 올리기 여부
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setImageSrc(URL.createObjectURL(file));
      console.log(imageSrc);
    }
  };
  return (
    <div>
      <p className="mb-[30px] mt-[60px] text-[32px] font-bold">
        간단한 드로잉을 통한 이모티콘 그리기 연습해요 !
      </p>
      <div className="flex h-full gap-5">
        <div className="flex h-full w-[80%] gap-[40px] rounded-3xl border border-gray-border-color px-[40px] py-[22px]">
          <div>
            {/* 프로필 이미지 */}
            <div className="relative h-[162px] w-[162px] rounded-full bg-[#565252]">
              <div className="absolute bottom-0 right-0 flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full bg-disabled-font-color">
                {/* 뱃지 svg로 초기화 */}
                <DefaultBadgeIcon />
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
              {checkFavorit ? (
                <button className="group flex items-center gap-2 rounded-xl border bg-primary-color p-2 px-3 font-semibold text-white transition-all duration-300 hover:bg-bg-gray-color hover:text-black">
                  <SubscribeIcon
                    className="stroke-white transition-colors duration-0 group-hover:stroke-black"
                    stroke="currentColor"
                  />
                  구독
                </button>
              ) : (
                <button className="group flex items-center gap-2 rounded-xl border bg-bg-gray-color p-2 px-3 font-semibold transition-all duration-300 hover:bg-primary-color hover:text-white">
                  <SubscribeIcon
                    className="stroke-black transition-colors duration-0 group-hover:stroke-white"
                    stroke="currentColor"
                  />
                  구독
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex w-[20%] items-center justify-center rounded-3xl border-[1px] border-solid border-gray-border-color">
          <div className=" flex h-[128px] w-[195px] flex-col items-center justify-center space-x-0 ">
            <span className="m-0 p-0 text-[24px] font-medium text-[#565252]">2024.01.24</span>
            <span className="m-0 mb-[15px] p-0 text-[30px] font-bold">09:00</span>
            <button className="rounded-lg bg-[#EFEFEF] px-[30px] py-[10px] text-[18px] font-semibold">
              라이브 종료
            </button>
          </div>
        </div>
      </div>
      <div className="mb-[10px] mt-[80px]">
        <p className="text-[32px] font-bold">그림 유사도를 확인해 보세요!</p>
        <p className="mt-[7px] text-[16px] font-normal">
          수업 종료 후 저장된 이미지를 업로드하시면 여러분의 그림 진척도를 AI가 분석해드립니다.
        </p>
      </div>
      <div className="flex flex-row items-center gap-[15px]">
        <label className="flex h-[63px] w-[1235px] items-center rounded-lg border-[1px] border-solid bg-[#E6E6E6] pl-[20px]  text-center text-[18px] font-semibold text-[#C6C6C6]">
          {fileName ? fileName : '사진을을 선택해 주세요.'}
        </label>
        <label
          htmlFor="file-upload"
          className="flex h-[63px] w-[119px] cursor-pointer items-center justify-center rounded-xl bg-[#EFEFEF] px-4 py-2 text-[18px] font-semibold text-black transition duration-300 "
        >
          사진 찾기
        </label>
        <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
      </div>
      <hr className="mb-[15px] mt-[15px]" />
      <div className="flex flex-row justify-end gap-[10px]">
        {showComparison && (
          <button
            onClick={() => window.location.reload()}
            className="h-[41px] w-[88px] rounded-xl bg-bg-gray-color"
          >
            뒤로가기
          </button>
        )}

        <button
          className="h-[41px] w-[88px] rounded-xl bg-blue-500 text-white"
          onClick={() => setShowComparison(true)}
        >
          비교하기
        </button>
      </div>
      <div>
        {/* 아래 similarity부분은 ai 분석 퍼센트가 들어올 자리 입니다. */}
        {showComparison && <AiSimilarityResultPage imageSrc={imageSrc} similarity={50} />}
      </div>
    </div>
  );
};
