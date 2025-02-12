import { Room, RoomEvent } from 'livekit-client';

// LiveKit 서비스 클래스
// WebRTC 기반 실시간 화상 통화 기능을 관리
export class LiveKitService {
  constructor(url) {
    this.url = url;
    this.room = new Room(); // LiveKit Room 인스턴스 생성
  }

  // 이벤트 리스너 설정
  // - TrackSubscribed: 새로운 참가자의 미디어 트랙이 구독될 때
  // - TrackUnsubscribed: 참가자가 나가거나 미디어 트랙이 제거될 때
  setupEventListeners(callbacks) {
    this.room.removeAllListeners(RoomEvent.TrackSubscribed);
    this.room.removeAllListeners(RoomEvent.TrackUnsubscribed);

    this.room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
      console.log('LiveKitService - Track 구독:', participant.identity);
      callbacks.onTrackSubscribed(track, publication, participant);
    });

    this.room.on(RoomEvent.TrackUnsubscribed, (track, publication) => {
      callbacks.onTrackUnsubscribed(track, publication);
    });
  }

  // LiveKit 서버 연결
  async connect(token) {
    try {
      await this.room.connect(this.url, token);
      return this.room;
    } catch (error) {
      console.error('LiveKitService - 연결 실패:', error);
      throw error;
    }
  }

  // 카메라/마이크 활성화
  async enableMedia() {
    try {
      await this.room.localParticipant.enableCameraAndMicrophone();
      return this.room.localParticipant.videoTrackPublications.values().next().value?.videoTrack;
    } catch (error) {
      console.error('LiveKitService - 미디어 활성화 실패:', error);
      throw error;
    }
  }

  // 연결 해제
  disconnect() {
    this.room?.disconnect();
  }
}
