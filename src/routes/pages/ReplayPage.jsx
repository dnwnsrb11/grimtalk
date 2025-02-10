import { Excalidraw } from '@excalidraw/excalidraw';
import { useEffect, useRef, useState } from 'react';

import sendData from '@/assets/test/testPainte.json';

export const ReplayPage = () => {
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
      const currentTimeData = sendData?.find((data, index) => {
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
      const maxTime = Math.max(...sendData.map((data) => data.time));
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
  }, []);

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
  // 전체 시간
  const maxTime = Math.max(...sendData.map((data) => data.time));
  return (
    <div>
      <div>
        <p>따라그리기</p>
        <p>투명도 작성</p>
        <input
          type="range"
          ref={opacityInputRef}
          defaultValue={100}
          min={0}
          max={100}
          step={1}
          className="h-2 w-40 cursor-pointer appearance-none rounded-full bg-gray-200"
          onChange={() => changeOpacity()}
        />
      </div>
      <div className="relative h-screen w-full">
        <div className="absolute left-0 top-4 z-30">
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-300"
            onClick={handlePlayPauseClick}
          >
            {isPlaying ? '일시정지' : '재생'}
          </button>
          <p>{currentTime} 초</p>
          <p>{maxTime}초</p>
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
