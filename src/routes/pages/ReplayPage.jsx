import { Excalidraw, exportToBlob } from '@excalidraw/excalidraw';
import { useQuery } from '@tanstack/react-query';
import { animate } from 'motion';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { _axiosAuth } from '@/api/instance';
import { NextPlayIcon, OpacityIcon, PlayingIcon, StopIcon } from '@/components/common/icons';
// import sendData from '@/assets/test/testPainte.json';
import { LoadingComponents } from '@/components/common/LoadingComponents';
import { ReplayWorkList } from '@/components/replayPage/ReplayWorkList';
import { handleApiError } from '@/utils/errorHandler';

export const ReplayPage = () => {
  const navigate = useNavigate();
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
      if (data.body?.code !== undefined) {
        // 코드가 200이 아닌 경우 에러 처리
        if (data.body.code !== 200) {
          handleApiError(data);
          throw new Error(data.body.message || '데이터를 찾을 수 없습니다');
        }
      }
      return data.body.data;
    },
  });

  // Excalidraw에 표시될 요소들
  const [elements, setElements] = useState([]);
  // ExcalidrawAPI 인스턴스
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  // 하단 api
  const [topExcalidrawAPI, setTopExcalidrawAPI] = useState(null);
  // 재생 상태 추적
  const [isPlaying, setIsplaying] = useState(false);
  // 현재 시간
  const [currentTime, setCurrentTime] = useState(0);

  // 진행도 카드
  // 현재 진행도 리스트로 보여주기
  const [workList, setWorkList] = useState([]);
  const addWorkList = (newItem) => {
    setWorkList((prevWorkList) => [newItem, ...prevWorkList]);
  };
  // 진행도 제거 로직
  const removeWorkList = (elementsToRemove) => {
    setWorkList((prevList) => prevList.slice(0, -elementsToRemove));
  };
  // 진행도 추가 로직
  const plusWorkList = (newElements) => {
    setWorkList((prevList) => [...newElements, ...prevList]);
  };
  // 진행도 모션
  const animationContainerRef = useRef(null);

  // 현재 색상값
  const [nowColor, setNowColor] = useState('None');
  const changeNowColor = (color) => {
    if (nowColor !== color) {
      setNowColor(color);
    }
  };
  // 현재 색상 스타일 값  = ref
  const colorBoxRef = useRef(null);

  useEffect(() => {
    const container = animationContainerRef.current;
    if (!container) return;

    // 가장 최근에 추가된 아이템 (첫 번째 아이템)
    const newItem = container.firstElementChild;
    if (newItem) {
      animate(
        newItem,
        {
          opacity: [0, 1],
          y: [-40, 0],
        },
        {
          duration: 0.3,
          easing: 'ease-out',
        },
      );
    }
    if (workList.length > 0 && colorBoxRef.current) {
      changeNowColor(workList[0]?.element?.strokeColor);
      colorBoxRef.current.style.backgroundColor = workList[0]?.element?.strokeColor || '#ffffff';
    }
  }, [workList]); // workList가 변경될 때마다 실행

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
        addWorkList(currentTimeData);
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
      // 처음 시작은 0초에서 시작하니 해당 값을 통해 이게 처음정지 하는건지 아닌지 체크가 가능
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
  const opacityInputRef = useRef(100);
  // 투명도 조절바 STYLE 관리
  const [rangeProgress, setRangeProgress] = useState(100);

  // 투명도 변경 함수
  const changeOpacity = () => {
    // 만약 두 ref가 있다면면
    if (bottomCanvasRef.current && opacityInputRef.current) {
      // 바를 통해 전달받은 value를 저장장
      const value = opacityInputRef.current.value;
      // 이후 이 값을 캠버스의 투명도 조절에 사용한다
      // 해당 방법을 사용한다면 리랜더링 없이 css로 투명도 조절이 가능하다 즉 좀더 안전하다.
      bottomCanvasRef.current.style.opacity = value / 100;
      setRangeProgress(value); //스타일 값 업데이트 해줌
    }
  };
  // 전체 시간 (0.1초가 아닌 1초)
  const maxTime = replayData ? Math.max(...replayData.map((data) => data.time)) / 10 : 0;

  // 시간 이동을 위한 함수!!
  const moveToTime = (newTime) => {
    const currentTimeInTicks = timeRef.current; //현재 시간
    const checkTime = newTime * 10; // 이동할 시간

    // 0보다 뒤로, 혹은 총 시간보다 높이 올라가게 하면 안됨
    let newTimeInTicks;
    if (checkTime < 0) {
      newTimeInTicks = 0;
    } else if (checkTime > maxTime * 10) {
      newTimeInTicks = maxTime * 10;
    } else {
      newTimeInTicks = checkTime;
    }

    // 만약 뒤로 이동한다면?
    if (newTimeInTicks < currentTimeInTicks) {
      // 제거 내용 체크
      const newElements = replayData
        .filter((data) => data.time <= newTimeInTicks)
        .map((data) => data.element)
        .filter(Boolean);

      // 전체 교체체
      accumulatedElementsRef.current = newElements;

      // 작업 리스트 계산
      // 작업 리스트도 새로 계산 (오류체크를 위해 element가 있는지도 체크)
      const newWorkListData = replayData.filter(
        (data) => data.time <= newTimeInTicks && data.element,
      ); // element가 있는 데이터만 필터

      setWorkList(newWorkListData);
    }

    // 만약 앞으로 이동한다면?
    else if (newTimeInTicks > currentTimeInTicks) {
      // 추가할 내용을 체크
      const newElements = replayData
        .filter((data) => data.time > currentTimeInTicks && data.time <= newTimeInTicks)
        // 여기서 time 값이 아닌 element 값만 챙겨간다
        .map((data) => {
          return data.element;
        })
        // 안전빵으로 null값을 제외
        .filter(Boolean);

      // 해당 ref는 누적된 리스트 배열이다 (즉 현재 시간의 그림 데이터 총 집합d) => 여기에 추가될 데이터를 넣어준다.
      accumulatedElementsRef.current = [...accumulatedElementsRef.current, ...newElements];

      // 작업 리스트용 data (전체 데이터)
      const newWorkListData = replayData.filter(
        (data) => data.time > currentTimeInTicks && data.time <= newTimeInTicks,
      );
      // 작업리스트(카드) 에도 넣어준다.
      plusWorkList(newWorkListData);
    }

    // 이제 시간을 업데이트 해준다.
    timeRef.current = newTimeInTicks;
    setCurrentTime(newTimeInTicks / 10);

    // 변경된 리스트를 엑스칼리드로우에 넣어준다.
    if (excalidrawAPI) {
      excalidrawAPI.updateScene({
        elements: accumulatedElementsRef.current,
      });
    }
  };

  // 선 색상 변경
  const updateColor = (color) => {
    if (!topExcalidrawAPI) return;
    if (color && color.startsWith('#')) {
      topExcalidrawAPI.updateScene({
        appState: {
          currentItemStrokeColor: color, // 선 색상
        },
      });
    }
    alert('색상이 변경되었습니다.');
  };

  // 이미지 내보내기
  const handleExportImage = async () => {
    if (!topExcalidrawAPI) return;

    try {
      // 씬 정보가져오기
      const elements = topExcalidrawAPI.getSceneElements();
      const appState = topExcalidrawAPI.getAppState();

      const blob = await exportToBlob({
        elements,
        appState,
        mimeType: 'image/png',
        quality: 1,
        exportPadding: 10,
      });
      console.log('이미지 추출 성공', blob);

      // 직렬화를 통해 전송 가능한 상태로 변경하자
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        // 먼저 값을 받아서 변환한다.
        reader.readAsDataURL(blob);
        // 성공하면 성공 내용을 반환
        reader.onloadend = () => resolve(reader.result);
        // 실패하면 실패를 반환
        reader.onerror = reject;
      });

      // 네비게이션으로 ai 페이지로 이동
      navigate('/aicompare', { state: { ImageData: base64Image } });
    } catch (error) {
      console.log('이미지 추출 실패', error);
    }
  };

  // 로딩
  if (isLoading) {
    return <LoadingComponents />;
  }
  if (isError) {
    navigate('/notfound');
  }
  return (
    <div>
      <div className="relative h-screen w-full">
        {/* 관리 구역(시간) */}
        <div className="absolute bottom-5 left-1/2 z-30 flex w-full min-w-[400px] max-w-[1100px] -translate-x-1/2 flex-col gap-2">
          <div
            className="flex items-center justify-center gap-4 rounded-2xl border bg-white p-2"
            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.17)' }}
          >
            <div className="flex items-center gap-6 rounded-2xl border bg-[#E7E7EF] p-2">
              <button onClick={() => moveToTime(currentTime - 5)} className="rotate-180 rounded">
                <NextPlayIcon />
              </button>
              <button
                className="rounded-full text-white disabled:bg-gray-300"
                onClick={handlePlayPauseClick}
              >
                <div className="relative h-5 w-5">
                  <div
                    className={`absolute left-0 top-0 transition-all duration-300 ${
                      isPlaying ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <StopIcon width={20} height={20} fill="#FF5C38" />
                  </div>
                  <div
                    className={`absolute left-0 top-0 transition-all duration-300 ${
                      isPlaying ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    <PlayingIcon width={20} height={20} fill="#FF5C38" />
                  </div>
                </div>
              </button>
              <button onClick={() => moveToTime(currentTime + 5)} className="rounded">
                <NextPlayIcon />
              </button>
            </div>
            {/* 타임바 */}
            <div className="group relative h-full w-[60%]">
              <div className="flex h-full items-center justify-center text-sm text-gray-500">
                <div className="flex h-full w-[100%] items-stretch">
                  {/* 움직이는 현재 시간 */}
                  <div className="opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div
                      className="absolute -top-14 rounded-xl border border-gray-border-color px-[20px] py-[5px]"
                      style={{
                        left: `${Math.min((currentTime / maxTime) * 100 - 7, 100)}%`,
                      }}
                    >
                      <p>{(timeRef.current / 10).toFixed(0)} 초</p>
                    </div>
                  </div>
                  {/* 총 시간 */}
                  <div className="absolute right-8 top-1/2 z-10 -translate-y-1/2">
                    <p
                      className={`${Math.min((currentTime / maxTime) * 100, 100) >= 98 ? 'text-white' : 'text-[#2E3032]'}`}
                    >
                      {maxTime.toFixed(0)}
                    </p>
                  </div>
                  {/* 현재ㄹㄹ 시간  -  퍼센트에 따라 텍스트 색상 변경*/}
                  <div className="absolute left-8 top-1/2 z-10 -translate-y-1/2">
                    <p
                      className={`${Math.min((currentTime / maxTime) * 100, 100) >= 6 ? 'text-white' : 'text-[#2E3032]'}`}
                    >
                      {(timeRef.current / 10).toFixed(0)}
                    </p>
                  </div>
                  {/* 재생바 */}
                  <input
                    type="range"
                    value={currentTime}
                    min={0}
                    max={maxTime}
                    step={0.1}
                    className="
                      [&::-webkit-slider-thumb]:scale-120
                      relative
                      m-0
                      h-10
                      w-full
                      cursor-pointer
                      appearance-none
                      rounded-xl
                      p-0
                      after:absolute
                      after:left-0
                      after:top-[50%]
                      after:h-full
                      after:w-[var(--range-progress)]
                      after:-translate-y-1/2
                      after:rounded-xl
                      after:bg-primary-color
                      [&::-webkit-slider-runnable-track]:h-full
                      [&::-webkit-slider-runnable-track]:rounded-xl
                      [&::-webkit-slider-runnable-track]:bg-[#E7E7EF]
                      [&::-webkit-slider-thumb]:w-4
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:rounded-xl
                      [&::-webkit-slider-thumb]:bg-primary-color
                      [&::-webkit-slider-thumb]:transition-all
                      [&::-webkit-slider-thumb]:hover:scale-150
                      [&::-webkit-slider-thumb]:hover:shadow-lg
                    "
                    style={{
                      '--range-progress': `${Math.min((currentTime / maxTime) * 100, 100)}%`,
                    }}
                    onChange={(e) => {
                      const newTime = parseFloat(e.target.value);
                      moveToTime(newTime);
                    }}
                  />
                </div>
              </div>
            </div>
            {/* 현재 색상값 - 투명도 */}
            <div className="flex w-[25%] items-center gap-2">
              <div className="group relative flex w-[100%] items-center justify-center rounded-xl border">
                {/* 투명도값 박스 -> 호버시 나타남 */}
                <div className="absolute -top-0 z-0 rounded-xl border border-gray-border-color px-[20px] py-[5px] opacity-0 transition-all duration-500 group-hover:-top-14 group-hover:opacity-100">
                  <p className="text-text-gray-color">{rangeProgress}</p>
                </div>
                {/* 아이콘 위치 */}
                <div className="absolute left-3 z-10">
                  <OpacityIcon width={22} height={22} fill={'#494949'} />
                </div>
                <input
                  type="range"
                  ref={opacityInputRef}
                  defaultValue={100}
                  min={0}
                  max={100}
                  step={1}
                  className={`
                    [&::-webkit-slider-thumb]:scale-120
                    relative
                    m-0
                    h-10
                    w-full
                    cursor-pointer
                    appearance-none
                    rounded-xl
                    p-0
                    after:absolute
                    after:left-0
                    after:top-[50%]
                    after:h-10
                    after:w-[var(--range-progress)]
                    after:-translate-y-1/2
                    after:rounded-xl
                    after:bg-[#E7E7EF]
                    [&::-webkit-slider-runnable-track]:h-10
                    [&::-webkit-slider-runnable-track]:rounded-xl
                    [&::-webkit-slider-runnable-track]:bg-gradient-to-r
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:rounded-xl
                    [&::-webkit-slider-thumb]:bg-primary-color
                    [&::-webkit-slider-thumb]:transition-all
                    [&::-webkit-slider-thumb]:hover:scale-150
                    [&::-webkit-slider-thumb]:hover:shadow-lg
                  `}
                  style={{
                    '--range-progress': `${rangeProgress}%`,
                    '--tw-gradient-from': '#E7E7EF var(--range-progress)',
                    '--tw-gradient-to': '#F4F4F4 var(--range-progress)',
                  }}
                  onChange={() => changeOpacity()}
                />
              </div>
              {/* 현재 색상 + 색상 변경 */}
              <div
                className="group relative flex min-w-[40%] cursor-pointer items-center justify-center gap-3 rounded-2xl border border-gray-border-color bg-white px-[15px] py-[10px] transition-colors duration-300 hover:border-white hover:bg-[#E7E7EF]"
                onClick={() => updateColor(nowColor)}
              >
                <div
                  ref={colorBoxRef}
                  className="h-[30px] w-[30px] rounded-md border border-gray-border-color text-center transition-colors duration-300"
                  style={{ backgroundColor: '#ffffff' }} // 초기값 설정
                ></div>
                <p className="text-[14px] font-light text-replay-disable-btn-font-color">
                  {nowColor}
                </p>
                <div className="absolute -top-0 rounded-xl border px-[15px] py-[5px] opacity-0 transition-all duration-500 group-hover:-top-14 group-hover:opacity-100">
                  <p className="text-text-gray-color">색상 변경</p>
                </div>
              </div>
            </div>
            {/* 이미지 추출 기능 */}
            <div className="w-[80px] text-center">
              <div className="group rounded-2xl border border-gray-border-color bg-white text-white transition-all duration-300 hover:bg-primary-color">
                <button className="p-4" onClick={handleExportImage}>
                  <p className="text-[16px] text-text-gray-color group-hover:text-white">완료</p>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* 작업 리스트 */}
        <div
          ref={animationContainerRef}
          className="absolute right-5 top-1/2 z-50 flex w-[200px] -translate-y-1/2 flex-col gap-2"
        >
          {workList.slice(0, 12).map((data, index) => (
            <div
              key={data.element.id || index}
              className="cursor-pointer transition-opacity duration-300"
              style={{
                opacity: index === 0 || index === 11 ? 0 : 1,
              }}
              onClick={() => moveToTime(data.time / 10)}
            >
              <ReplayWorkList data={data} />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 z-20 border">
          <Excalidraw
            // 엑스칼리드로우 사용하는 부분에 api도 연결
            excalidrawAPI={(api) => setTopExcalidrawAPI(api)}
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
