import { Excalidraw } from '@excalidraw/excalidraw';
import { Client } from '@stomp/stompjs';
import { useCallback, useEffect, useState } from 'react';

export const LivePage = () => {
  // STOMP와 Excalidraw 관련 상태
  const [elements, setElements] = useState([]);
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // STOMP 연결 설정
  useEffect(() => {
    const client = new Client({
      brokerURL: 'wss://www.grimtalk.com/api/ws',
      onConnect: () => {
        setIsConnected(true);
        console.log('Connected to STOMP');
      },
      onDisconnect: () => {
        setIsConnected(false);
        console.log('Disconnected from STOMP');
      },
    });

    try {
      client.activate();
      setStompClient(client);
    } catch (error) {
      console.error('STOMP connection failed:', error);
    }

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, []);

  // STOMP 구독 설정
  useEffect(() => {
    if (stompClient && isConnected) {
      console.log('STOMP 구독 시작');

      const subscription = stompClient.subscribe('/topic/greetings', (message) => {
        const data = JSON.parse(message.body);
        console.log(data);

        if (data.type === 'excalidraw') {
          console.log('그림 데이터 수신:', data.elements);
          setElements(data.elements);
          if (excalidrawAPI) {
            excalidrawAPI.updateScene({ elements: data.elements });
            console.log('화면에 그림 업데이트 완료');
          }
        }
      });

      return () => {
        console.log('STOMP 구독 종료');
        subscription.unsubscribe();
      };
    }
  }, [stompClient, isConnected]);

  // 화이트보드 업데이트 함수
  const updateBoard = useCallback(
    (elements) => {
      if (stompClient?.active && isConnected) {
        const message = {
          type: 'excalidraw',
          elements: elements,
        };
        console.log('그림 데이터 전송:', message);

        try {
          stompClient.publish({
            destination: '/app/hello',
            body: JSON.stringify(message),
          });
          console.log('데이터 전송 완료');
        } catch (error) {
          console.error('데이터 전송 실패:', error);
        }
      }
    },
    [stompClient, isConnected],
  );

  return (
    <div className="h-screen w-full">
      <div className="h-full">
        <h3>화이트보드</h3>
        <Excalidraw
          onChange={(elements) => {
            setElements(elements);
            updateBoard(elements);
          }}
          elements={elements}
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
        />
      </div>
    </div>
  );
};
