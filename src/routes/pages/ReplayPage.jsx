import { Excalidraw } from '@excalidraw/excalidraw';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

import { _axiosAuth } from '@/api/instance';
// import sendData from '@/assets/test/testPainte.json';
import { LoadingComponents } from '@/components/common/LoadingComponents';

export const ReplayPage = () => {
  // api 호출
  const {
    data: replayData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['replayData'],
    queryFn: async () => {
      const { data } = await _axiosAuth.get(`/stroke/${1}`);
      return data.body.data;
    },
  });

  // Excalidraw에 표시될 요소들
  const [elements, setElements] = useState([]);
  // ExcalidrawAPI 인스턴스
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  // 재생 상태 추적
  const [isPlaying, setIsplaying] = useState(false);
  // 현재 시간
  const [currentTime, setCurrentTime] = useState(0);

  // Ref 관리
  const timeRef = useRef(0); // 현재 재생 시간을 추적
  const intervalRef = useRef(null); // setInterval ID를 저장
  const accumulatedElementsRef = useRef([]); // 누적된 그리기 요소들을 저장

  // 공통 interval 로직
  const startInterval = () => {
    // 타임시작 interval
    intervalRef.current = setInterval(() => {
      timeRef.current += 1;
      setCurrentTime(timeRef.current / 10);

      // 현재 시간에서 동일한 time을 가진 친구의 data를 가져온다.(반환)
      const currentTimeData = replayData?.find((data, index) => {
        if (index <= 1) return false;
        return data.time === timeRef.current;
      });

      // 만약 데이터가 있고, 데이터 안에 element가 있다면
      // 전달 (누적되고 있는 리스트)리스트에 값을 넣어준다
      if (currentTimeData && currentTimeData.element) {
        accumulatedElementsRef.current = [
          ...accumulatedElementsRef.current,
          currentTimeData.element,
        ];
        // 이후 해당 값을 excalidraw에 넣어준다
        if (excalidrawAPI) {
          excalidrawAPI.updateScene({
            elements: accumulatedElementsRef.current,
          });
        }
      }

      // 마지막까지 왓는지 체크 -> 만약 정부 시간을 봣다면 관련 interval을 제거해준다(최적화)
      const maxTime = replayData ? Math.max(...replayData.map((data) => data.time)) : 0;
      if (timeRef.current >= maxTime) {
        clearInterval(intervalRef.current);
        setIsplaying(false);
      }
    }, 100);
  };

  // 처음부터 시작하는 함수
  const updateScene = () => {
    setIsplaying(true);
    timeRef.current = 0;
    accumulatedElementsRef.current = [];
    setElements([]);

    if (excalidrawAPI) {
      excalidrawAPI.updateScene({
        elements: [],
      });
    }

    startInterval();
  };

  // 일시정지 함수
  const pauseScene = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      setIsplaying(false);
    }
  };

  // 중간부터 재시작하는 함수
  const resumeScene = () => {
    setIsplaying(true);
    startInterval();
  };

  // 재생/일시정지 버튼 핸들러
  const handlePlayPauseClick = () => {
    if (!isPlaying) {
      // 처음 시작이거나 끝까지 재생된 경우
      if (timeRef.current === 0) {
        updateScene();
      } else {
        // 일시정지 후 재시작하는 경우
        resumeScene();
      }
    } else {
      // 재생 중인 경우 일시정지
      pauseScene();
    }
  };

  // 컴포넌트 언마운트시 정리
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [replayData]);

  // 스타일 ref
  const bottomCanvasRef = useRef(null);
  const opacityInputRef = useRef(null);

  // 투명도 변경 함수
  const changeOpacity = () => {
    if (bottomCanvasRef.current && opacityInputRef.current) {
      const value = opacityInputRef.current.value;
      bottomCanvasRef.current.style.opacity = value / 100;
    }
  };
  // 전체 시간 (0.1초가 아닌 1초)
  const maxTime = replayData ? Math.max(...replayData.map((data) => data.time)) / 10 : 0;
  // 로딩
  if (isLoading) {
    return <LoadingComponents />;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div>
      <div className="relative h-screen w-full">
        <div className="absolute bottom-5 left-1/2 z-30 min-w-[350px] -translate-x-1/2 rounded-2xl border bg-[#ECECF4] p-1">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-3 p-5">
              <button
                className="rounded bg-primary-color px-4 py-2 text-white disabled:bg-gray-300"
                onClick={handlePlayPauseClick}
              >
                {isPlaying ? '일시정지' : '재생'}
              </button>
              <div className="rounded-full border border-primary-color px-[15px] py-[5px]">
                <p className="text-text-gray-color">
                  <span className="text-[18px] font-bold text-primary-color ">
                    {Math.floor(currentTime)}
                  </span>{' '}
                  초
                </p>
              </div>
              <p className="text-text-gray-color">
                <span className="font-bol text-[18px] "> {maxTime} 초</span>(전체 시간)
              </p>
            </div>
            <div>
              <input
                type="range"
                ref={opacityInputRef}
                defaultValue={100}
                min={0}
                max={100}
                step={1}
                className="
   h-2 w-40
   cursor-pointer
   appearance-none
   rounded-full
   bg-white
   [&::-webkit-slider-thumb]:h-4
   [&::-webkit-slider-thumb]:w-4
   [&::-webkit-slider-thumb]:appearance-none
   [&::-webkit-slider-thumb]:rounded-full
   [&::-webkit-slider-thumb]:bg-primary-color
   [&::-webkit-slider-thumb]:transition-all
   [&::-webkit-slider-thumb]:hover:scale-125
   [&::-webkit-slider-thumb]:hover:shadow-lg
 "
                onChange={() => changeOpacity()}
              />
            </div>
          </div>
        </div>

        <div className="absolute inset-0 z-20 border">
          <Excalidraw
            initialData={{
              appState: {
                viewBackgroundColor: 'transparent',
              },
            }}
          />
        </div>

        <div ref={bottomCanvasRef} className="absolute inset-0 z-10">
          <Excalidraw
            viewModeEnabled={true}
            excalidrawAPI={(api) => setExcalidrawAPI(api)}
            initialData={{
              appState: {
                viewBackgroundColor: 'transparent',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};
