import PopularIMG1 from '@/assets/banner/PopularIMG_1.svg';
import posterNoneImg from '@/assets/posterNoneImg.png';

export const PopularInstructor = (instroductor) => {
  const instroductorNickname = instroductor.nickname || '더미닉네임';
  const instroductorImg = instroductor.image || posterNoneImg;
  const instroductorTags = instroductor.tags || ['더미태그1', '더미태그2'];
  return (
    <>
      <div className="flex items-center justify-between rounded-2xl border p-[20px]">
        <div className="flex items-center gap-4">
          <div>
            <img src={PopularIMG1} alt="img" className="h-[38px] w-[38px]" />
          </div>
          <div>
            <div className="h-[80px] w-[80px] overflow-hidden rounded-full">
              <img
                src={instroductorImg}
                alt="Profile-img"
                className="h-[100%] w-[100%] object-cover"
              />
            </div>
          </div>
          <div>
            <div>
              <p className="text-[18px] font-bold">{instroductorNickname}</p>
            </div>
            <div className="mt-1">
              {instroductorTags?.map((tag, index) => (
                <div className="mr-1 inline-block rounded-full border bg-bg-gray-color px-3 py-1">
                  <p className="text-text-gray-color">{tag}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <button className='className="w-[140px] text-center" rounded-lg bg-[#FFC2B4] px-1 py-3'>
            <p className="text-lg font-medium text-[#D2310C]">강사 알아보기</p>
          </button>
        </div>
      </div>
    </>
  );
};
