import PopularIMG1 from '@/assets/banner/PopularIMG_1.svg';
import testImg from '@/assets/banner/Test/TestImg.png';

export const PopularInstructor = (Array) => {
  return (
    <>
      <div className="flex items-center justify-between rounded-2xl border p-[20px]">
        <div className="flex items-center gap-4">
          <div>
            <img src={PopularIMG1} alt="img" className="h-[38px] w-[38px]" />
          </div>
          <div>
            <div className="h-[80px] w-[80px] overflow-hidden rounded-full">
              <img src={testImg} alt="Profile-img" className="h-[100%] w-[100%] object-cover" />
            </div>
          </div>
          <div>
            <div>
              <p className="text-[18px] font-bold">김싸피</p>
            </div>
            <div className="mt-1">
              <div className="mr-1 inline-block rounded-full border bg-bg-gray-color px-3 py-1">
                <p className="text-text-gray-color">열정있는</p>
              </div>
              <div className="mr-1 inline-block rounded-full border bg-bg-gray-color px-3 py-1">
                <p className="text-text-gray-color">끈기있는</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="w-[140px] rounded-lg bg-[#FFC2B4] px-1 py-3 text-center">
            <p className="text-lg font-medium text-[#D2310C]">강사 알아보기</p>
          </div>
        </div>
      </div>
    </>
  );
};
