import { useNavigate } from 'react-router-dom';

import testImg from '@/assets/banner/Test/TestImg.png';

// 라이브 방 카드 컴포넌트
export const LiveList = ({ curriculumSubject, instructor }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="relative min-h-[160px] overflow-hidden rounded-lg">
        <button onClick={() => navigate(`/live/${curriculumSubject}`)}>
          <div className="absolute left-[5%] top-[5%]">
            <div className="inline-block rounded-full bg-black bg-opacity-60 px-3 py-1">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-primary-color opacity-100" />
                <p className="text-white">LIVE</p>
              </div>
            </div>
          </div>
          <img src={testImg} alt="" className="h-full w-full object-cover" />
        </button>
      </div>
      <div>
        <h4 className="mt-2 text-lg leading-tight">{curriculumSubject}</h4>
        <div className="mt-2 flex items-center gap-3">
          <h4 className="text-base font-bold">{instructor}</h4>
          <div className="flex gap-1">
            <div className="inline-block rounded-full border bg-bg-gray-color px-3 py-1">
              <p className="text-text-gray-color">일러스트</p>
            </div>
            <div className="inline-block rounded-full border bg-bg-gray-color px-3 py-1">
              <p className="text-text-gray-color">캐릭터</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
