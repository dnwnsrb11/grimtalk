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
  async enableMedia(askPermission = true) {
    try {
      let enableCamera = true;
      let enableMic = true;

      if (askPermission) {
        // 사용자에게 카메라/마이크 활성화 여부 확인
        enableCamera = window.confirm('카메라를 활성화하시겠습니까?');
        enableMic = window.confirm('마이크를 활성화하시겠습니까?');
      }

      const promises = [];

      // 사용자가 선택한 디바이스만 활성화
      if (enableCamera) {
        promises.push(
          this.room.localParticipant.setCameraEnabled(true).catch((err) => {
            console.warn('LiveKitService - 카메라 활성화 실패:', err);
            return null;
          }),
        );
      }

      if (enableMic) {
        promises.push(
          this.room.localParticipant.setMicrophoneEnabled(true).catch((err) => {
            console.warn('LiveKitService - 마이크 활성화 실패:', err);
            return null;
          }),
        );
      }

      // 선택된 디바이스 활성화 처리
      if (promises.length > 0) {
        await Promise.all(promises);
      }

      // 카메라 트랙 반환 (이전과 동일)
      return this.room.localParticipant.videoTrackPublications.values().next().value?.videoTrack;
    } catch (error) {
      console.warn('LiveKitService - 미디어 활성화 중 예상치 못한 오류:', error);
      return null;
    }
  }

  // 연결 해제
  disconnect() {
    this.room?.disconnect();
  }
}
