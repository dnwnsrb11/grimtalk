import { useState } from 'react';
export const AiSimilarityPage = () => {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };
  return (
    <div>
      <p className="mb-[30px] mt-[60px] text-[32px] font-bold">
        간단한 드로잉을 통한 이모티콘 그리기 연습해요 !
      </p>
      <div className="flex flex-row gap-[20px]">
        <div>
          <div className="flex h-[206px] w-[1088px] items-center rounded-md border-[1px] border-solid border-[#D9D9D9] shadow-lg">
            {/* 상대 위치를 기준으로 두 이미지 배치 */}
            <div className="relative ml-[40px] h-[162px] w-[162px] ">
              {/* 첫 번째 이미지: 배경 이미지 */}
              <img
                src=""
                className="h-full w-full rounded-full bg-[#565252] object-cover shadow-xl "
              />
              {/* 두 번째 이미지: 오른쪽 아래 고정 (40px 유지) */}
              <img
                src="/src/assets/ex.png"
                className="absolute bottom-[10px] right-[10px] h-[40px] w-[40px] translate-x-1/4 translate-y-1/4 transform rounded-full bg-[#D9D9D9] object-cover"
              />
            </div>
            <div className="mb-3 ml-10 flex h-[157px] w-[783px] flex-col gap-[15px]">
              <p className="text-[24px] font-bold">Woojungyu</p>

              <div className=" text-[16px] font-normal leading-tight">
                남자중에 남자.남자중에 남자.남자중에 남자.남자중에 남자.남자중에 남자.남자중에
                남자.남자중에 남자.남자중에 남자.남자중에 남자.남자중에 남자.남자중에 남자.남자중에
                남자.남자중에 남자.남자중에 남자.남자중에 남자.남자중에 남자.남자중에 남자.남자중에
                남자.남자중에 남자.남자중에 남자.
              </div>
              <div className="flex gap-[15px]">
                <button className="h-[41px] w-[88px] rounded-lg border-solid bg-[#EFEFEF] text-[16px] font-semibold">
                  자세히 보기
                </button>
                <div>
                  <button className="flex h-[41px] w-[88px] flex-row items-center justify-center rounded-lg border-solid bg-[#EFEFEF] text-[16px]">
                    <div>
                      <img src="/src/assets/Group.png" className="mr-3 h-[18px] w-[18px]" />
                    </div>
                    <div className="text-[18px] font-semibold">구독</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div></div>
        </div>
        <div className="flex h-[206px] w-[255px] items-center justify-center rounded-md border-[1px] border-solid border-[#D9D9D9] shadow-lg">
          <div className=" flex h-[128px] w-[195px] flex-col items-center justify-center space-x-0 ">
            <span className="m-0 p-0 text-[24px] font-medium text-[#565252]">2024.01.24</span>
            <span className="m-0 mb-[15px] p-0 text-[30px] font-bold">09:00</span>
            <button className="h-[41px] w-[195px] rounded-lg bg-[#EFEFEF] text-[18px] font-semibold">
              라이브가 종료되었습니다.
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
          {fileName ? fileName : '동영상을 선택해 주세요.'}
        </label>
        <label
          htmlFor="file-upload"
          className="flex h-[63px] w-[119px] cursor-pointer items-center justify-center rounded-xl bg-[#EFEFEF] px-4 py-2 text-[18px] font-semibold text-black transition duration-300 "
        >
          영상 찾기
        </label>
        <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
      </div>

      <hr className="mb-[15px] mt-[15px]" />
      <div className="flex flex-row justify-end gap-[10px]">
        <button className="h-[41px] w-[88px] rounded-xl bg-bg-gray-color">뒤로가기</button>
        <button className="h-[41px] w-[88px] rounded-xl bg-primary-color text-white">
          비교하기
        </button>
      </div>
    </div>
  );
};
