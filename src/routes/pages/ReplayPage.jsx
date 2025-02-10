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

  // Ref 관리
  const timeRef = useRef(0); // 현재 재생 시간을 추적
  const intervalRef = useRef(null); // setInterval ID를 저장
  const accumulatedElementsRef = useRef([]); // 누적된 그리기 요소들을 저장

  // 재생 시작 함수
  const updateScene = () => {
    setIsplaying(true);
    timeRef.current = 0;
    accumulatedElementsRef.current = [];
    setElements([]);

    // api 콜백함수 받아오면 화면 초기화 실행
    if (excalidrawAPI) {
      excalidrawAPI.updateScene({
        elements: [],
      });
    }

    // 0.1초마다 실행되는 재생 로직을 설정
    intervalRef.current = setInterval(() => {
      timeRef.current += 1; //시간을 0.1초 단위로 증가

      // 현재 시간에 해당하는 그림 데이터를 찾음
      // 인덱스 0,1은 초기화 데이터이므로 제외
      const currentTimeData = sendData?.find((data, index) => {
        if (index <= 1) return false;
        return data.time === timeRef.current;
      });

      // 현재 시간에 해당하는 데이터가 존재하고 element가 있는 경우
      if (currentTimeData && currentTimeData.element) {
        // 새로운 요소를 누적 배열에 추가
        accumulatedElementsRef.current = [
          ...accumulatedElementsRef.current,
          currentTimeData.element,
        ];

        // excalidraw 캠버스를 누적된 요소들로 업데이트
        if (excalidrawAPI) {
          excalidrawAPI.updateScene({
            elements: accumulatedElementsRef.current,
          });
        }
      }

      // 모든 데이터의 재생이 완료되었는지 확인
      const maxTime = Math.max(...sendData.map((data) => data.time));
      if (timeRef.current >= maxTime) {
        clearInterval(intervalRef.current);
        setIsplaying(false);
      }
    }, 100); //0.1초 간격으로 실행
  };

  // 컴포넌트 언마운트시 재생 인터벌을 정리
  useEffect(() => {
    console.log(sendData);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <>
      <div>
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-300"
          onClick={updateScene}
          disabled={isPlaying} //재생시 버튼 비활성화 -> 추후 변경 필요
        >
          {isPlaying ? '재생 중...' : '시작하기'}
        </button>
      </div>
      <div className="h-[80vh] w-full">
        {/* 엑스칼리드로 api 콜백함수 사용 */}
        <Excalidraw excalidrawAPI={(api) => setExcalidrawAPI(api)} />
      </div>
    </>
  );
};
