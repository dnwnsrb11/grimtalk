const TOKEN_TYPES = {
  RTC: 'rtc',
  CHAT: 'chat',
};

const participantUtils = {
  // 토큰용 참가자 이름 생성 (rtc/chat 접두사 추가)
  getTokenParticipantName: (participantName, type) => {
    return `${type} ${participantName}`;
  },

  // 화면 표시용 참가자 이름 (접두사 제거)
  getDisplayName: (participantName) => {
    return participantName.replace(`${TOKEN_TYPES.RTC} `, '').replace(`${TOKEN_TYPES.CHAT} `, '');
  },

  // 방장 여부 확인
  isCreator: (participantName) => {
    const storedCreator = localStorage.getItem('roomCreator');
    return participantName === storedCreator;
  },
};

export { participantUtils, TOKEN_TYPES };
