import { Client } from '@stomp/stompjs';

// STOMP 웹소켓 서비스 클래스
// 화이트보드 실시간 공유 기능을 위한 웹소켓 통신 관리
export class StompService {
  constructor(url) {
    // STOMP 클라이언트 설정
    this.client = new Client({
      brokerURL: url,
      onConnect: () => {
        this.isConnected = true;
        console.log('STOMP 연결 성공');
      },

      onDisconnect: () => {
        this.isConnected = false;
        console.log('STOMP 연결 해제');
      },
    });
  }

  // 웹소켓 연결
  connect() {
    try {
      this.client.activate();
    } catch (error) {
      console.error('STOMP 연결 실패:', error);
    }
  }

  // 웹소켓 연결 해제
  disconnect() {
    if (this.client?.active) {
      this.client.deactivate();
    }
  }

  // 특정 주제 구독
  subscribe(destination, callback) {
    if (this.client?.active) {
      return this.client.subscribe(destination, callback);
    }
  }

  // 메시지 발행
  publish(destination, message) {
    if (this.client?.active && this.isConnected) {
      try {
        this.client.publish({
          destination,
          body: JSON.stringify(message),
        });
      } catch (error) {
        console.error('STOMP 메시지 전송 실패:', error);
      }
    }
  }
}
