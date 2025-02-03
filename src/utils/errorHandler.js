// 상수 정의
const ERROR_CODES = {
  // 4000번대: 클라이언트 요청 오류
  DUPLICATE_EMAIL: 4001,
  NOT_FOUND_MEMBER: 4002,
  PASSWORD_MISMATCH: 4003,
  LOGIN_FAILED: 4004,

  // 4100번대: 게시판 관련 오류
  NOT_FOUND_BOARD: 4101,
  FORBIDDEN_MODIFY_BOARD: 4102,
  FORBIDDEN_DELETE_BOARD: 4103,
  FORBIDDEN_DELETE_BOARD_COMMENT: 4104,

  // 4200번대: 강의/구독 관련 오류
  NOT_FOUND_LECTURE: 4201,
  ALREADY_SUBSCRIBED: 4201,
  NOT_ALLOWED_SELF_SUBSCRIPTION: 4202,

  // 5000번대: 인증/인가 오류
  EXPIRED_ACCESS_TOKEN: 5001,
  EXPIRED_REFRESH_TOKEN: 5002,
  INVALID_ACCESS_TOKEN: 5003,
  INVALID_REFRESH_TOKEN: 5004,
  NOT_FOUND_REFRESH_TOKEN: 5005,
  NOT_FOUND_ACCESS_TOKEN: 5006,

  // 6000번대: 시스템 오류
  FILE_UPLOAD_ERROR: 6001,
};

const handleErrorByCode = (code, message) => {
  switch (code) {
    // 4000번대: 클라이언트 요청 오류
    case ERROR_CODES.DUPLICATE_EMAIL:
      alert('이미 사용 중인 이메일입니다.');
      break;
    case ERROR_CODES.NOT_FOUND_MEMBER:
      alert('사용자를 찾을 수 없습니다.');
      break;
    case ERROR_CODES.PASSWORD_MISMATCH:
      alert('비밀번호가 일치하지 않습니다.');
      break;
    case ERROR_CODES.LOGIN_FAILED:
      alert('로그인에 실패하였습니다.');
      break;

    // 4100번대: 게시판 관련 오류
    case ERROR_CODES.NOT_FOUND_BOARD:
      alert('게시판 글을 찾을 수 없습니다.');
      break;
    case ERROR_CODES.FORBIDDEN_MODIFY_BOARD:
      alert('게시글 수정 권한이 없습니다.');
      break;
    case ERROR_CODES.FORBIDDEN_DELETE_BOARD:
      alert('게시글 삭제 권한이 없습니다.');
      break;
    case ERROR_CODES.FORBIDDEN_DELETE_BOARD_COMMENT:
      alert('게시글 댓글 삭제 권한이 없습니다.');
      break;

    // 4200번대: 강의/구독 관련 오류
    case ERROR_CODES.NOT_FOUND_LECTURE:
      alert('해당 강의를 찾을 수 없습니다.');
      break;
    case ERROR_CODES.ALREADY_SUBSCRIBED:
      alert('이미 구독한 강사입니다.');
      break;
    case ERROR_CODES.NOT_ALLOWED_SELF_SUBSCRIPTION:
      alert('자기 자신을 구독할 수 없습니다.');
      break;

    // 5000번대: 인증/인가 오류
    case ERROR_CODES.EXPIRED_ACCESS_TOKEN:
    case ERROR_CODES.INVALID_ACCESS_TOKEN:
    case ERROR_CODES.NOT_FOUND_ACCESS_TOKEN:
      // 인터셉터에서 처리하므로 여기서는 무시
      break;
    case ERROR_CODES.EXPIRED_REFRESH_TOKEN:
    case ERROR_CODES.INVALID_REFRESH_TOKEN:
    case ERROR_CODES.NOT_FOUND_REFRESH_TOKEN:
      alert('세션이 만료되었습니다. 다시 로그인해주세요.');
      break;

    // 6000번대: 시스템 오류
    case ERROR_CODES.FILE_UPLOAD_ERROR:
      alert('파일 업로드에 실패했습니다.');
      break;

    default:
      console.error(`미처리 에러 코드: ${code}`, message);
  }
};

/**
 * API 에러 응답 처리 함수
 * @param {object} response - API 응답 객체
 */
const handleApiError = (response) => {
  const { code, message } = response.data.data.body;
  handleErrorByCode(code, message);
};

export { ERROR_CODES, handleApiError };
