import { Excalidraw } from '@excalidraw/excalidraw';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

import { _axiosAuth } from '@/api/instance';
import { PlayingIcon, StopIcon } from '@/components/common/icons';
// import sendData from '@/assets/test/testPainte.json';
import { LoadingComponents } from '@/components/common/LoadingComponents';
import { ReplayWorkList } from '@/components/replayPage/ReplayWorkList';

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
      const { data } = await _axiosAuth.get(`/stroke/${4}`); //추후 api 요청 하드코딩에서 변경 예정
      // 만약 데이터가 없다면
      if (data.body?.code) {
        if (data.body.code === 404) {
          alert('현재 데이터를 찾을수 없습니다.');
        }
      }
      return data.body.data;
    },
    onError: (error) => {
      console.log('error', error);
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
  // 현재 진행도 리스트로 보여주기
  const [workList, setWorkList] = useState([]);
  const addWorkList = (newItem) => {
    setWorkList((prevWorkList) => [newItem, ...prevWorkList]);
  };

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
        if (data.time === 0) return false;
        return data.time === timeRef.current;
      });

      // 만약 데이터가 있고, 데이터 안에 element가 있다면
      // 전달 (누적되고 있는 리스트)리스트에 값을 넣어준다
      if (currentTimeData && currentTimeData.element) {
        accumulatedElementsRef.current = [
          ...accumulatedElementsRef.current,
          currentTimeData.element,
        ];
        addWorkList(currentTimeData.element);
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
    // 처음 시작하는 함수 -> 초기 시간 값을 0으로 초기화
    timeRef.current = 0;
    accumulatedElementsRef.current = [];
    // excalidraw에 넘길 데이터를 초기화
    setElements([]);

    // 처음 시작하는 재생함수이니 -> excalidraw를 초기화 시켜준다.
    if (excalidrawAPI) {
      excalidrawAPI.updateScene({
        elements: [],
      });
    }
    // 이후 시간 함수를 실행하여 재생기능을 활성화 한다.
    startInterval();
  };

  // 일시정지 함수
  const pauseScene = () => {
    // 만약 시간이 흐른다면
    if (intervalRef.current) {
      // 해당 함수를 배제하고고
      clearInterval(intervalRef.current);
      // 재생체크를 false로 변경한다
      setIsplaying(false);
    }
  };

  // 중간부터 재시작하는 함수
  const resumeScene = () => {
    // 재생체크를 다시 true 로 변경
    setIsplaying(true);
    // 다시 재생함수를 실행
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
  // 캠버스 ref
  const bottomCanvasRef = useRef(null);
  // 투명도 조절 ref
  const opacityInputRef = useRef(null);

  // 투명도 변경 함수
  const changeOpacity = () => {
    // 만약 두 ref가 있다면면
    if (bottomCanvasRef.current && opacityInputRef.current) {
      // 바를 통해 전달받은 value를 저장장
      const value = opacityInputRef.current.value;
      // 이후 이 값을 캠버스의 투명도 조절에 사용한다
      // 해당 방법을 사용한다면 리랜더링 없이 css로 투명도 조절이 가능하다 즉 좀더 안전하다.
      bottomCanvasRef.current.style.opacity = value / 100;
    }
  };
  // 전체 시간 (0.1초가 아닌 1초)
  const maxTime = replayData ? Math.max(...replayData.map((data) => data.time)) / 10 : 0;

  // 시간 이동을 위한 함수!!
  const moveToTime = (newTime) => {
    const currentTimeInTicks = timeRef.current; //현재 시간
    const newTimeInTicks = newTime * 10; // 이동할 시간

    // 만약 뒤로 이동한다면?
    if (newTimeInTicks < currentTimeInTicks) {
      // 제거 내용 체크
      const elementsToRemove = replayData.filter(
        (data) => data.time > newTimeInTicks && data.time <= currentTimeInTicks,
      ).length;

      // 마지막 부터 해당길이 만큼 제거
      accumulatedElementsRef.current = accumulatedElementsRef.current.slice(0, -elementsToRemove);
    }

    // 만약 앞으로 이동한다면?
    else if (newTimeInTicks > currentTimeInTicks) {
      // 추가할 내용을 체크
      const newElements = replayData
        .filter((data) => data.time > currentTimeInTicks && data.time <= newTimeInTicks)
        // 여기서 time 값이 아닌 element 값만 챙겨간다
        .map((data) => data.element)
        .filter(Boolean);

      // 해당 ref는 누적된 리스트 배열이다 (즉 현재 시간의 그림 데이터 총 집합d) => 여기에 추가될 데이터를 넣어준다.
      accumulatedElementsRef.current = [...accumulatedElementsRef.current, ...newElements];
    }

    // 이제 시간을 업데이트 해준다.
    timeRef.current = newTimeInTicks;
    setCurrentTime(newTime);

    // 변경된 리스트를 엑스칼리드로우에 넣어준다.
    if (excalidrawAPI) {
      excalidrawAPI.updateScene({
        elements: accumulatedElementsRef.current,
      });
    }
  };

  useEffect(() => {
    if (workList.length > 5) {
      const timer = setTimeout(() => {
        setWorkList((prev) => {
          const newList = [...prev];
          newList.pop(); // 가장 오래된 항목 제거
          return newList;
        });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [workList]);

  // 로딩
  if (isLoading) {
    return <LoadingComponents />;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div>
      <div className="relative h-[80vh] w-full">
        <div className="absolute bottom-5 left-1/2 z-30 min-w-[350px] -translate-x-1/2 rounded-2xl border bg-[#ECECF4] p-1">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-3 p-5">
              <button
                className="rounded bg-primary-color px-4 py-2 text-white disabled:bg-gray-300"
                onClick={handlePlayPauseClick}
              >
                <div className="relative h-5 w-5">
                  <div
                    className={`absolute left-0 top-0 transition-all duration-300 ${
                      isPlaying ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <StopIcon />
                  </div>
                  <div
                    className={`absolute left-0 top-0 transition-all duration-300 ${
                      isPlaying ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    <PlayingIcon />
                  </div>
                </div>
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
              <button onClick={() => moveToTime(currentTime - 5)} className="rounded">
                5초 뒤로
              </button>
              <button onClick={() => moveToTime(currentTime + 5)} className="rounded">
                5초 앞으로
              </button>
            </div>
            {/* 아래가 투명도 그래프 */}
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
      {/* 테스트를 위한 구역 */}
      <div className="relative mb-[100px] mt-[40px] flex h-[500px] flex-col gap-2 overflow-hidden p-2">
        {workList.slice(0, 5).map((elewment, index) => (
          <div
            key={element.id || index}
            className="absolute w-full transform transition-all duration-300 ease-out"
            style={{
              animation: index === 0 ? 'slideInAndStack 0.3s ease-out forwards' : '',
              opacity: index === 0 ? 0 : 1,
              top: `${index * 108}px`, // 카드 height(100px) + gap(8px)
              transform: `translateY(0)`,
            }}
          >
            <ReplayWorkList element={element} />
            <style jsx>{`
              @keyframes slideInAndStack {
                from {
                  opacity: 0;
                  transform: translateY(-108px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>
          </div>
        ))}
      </div>
    </div>
  );
};
