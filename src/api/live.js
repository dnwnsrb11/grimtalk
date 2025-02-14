import { useQuery } from '@tanstack/react-query';

import { _axios, _axiosAuth } from '@/api/instance';

const LIVE_JOIN_STATUS_URL = import.meta.env.VITE_LIVE_JOIN_STATUS_URL;

// LiveKit 관련 API 호출 모음
const liveApi = {
  // 강사용 토큰 발급 (방 생성 시 사용)
  getInstructorToken: async (curriculumId, curriculumSubject, userId, userNickname) => {
    const response = await _axiosAuth.post('/token/instructor', {
      curriculumId,
      curriculumSubject,
      userId,
      userNickname,
      isLive: true,
    });
    return response.data.token;
  },

  // 학생용 토큰 발급 (방 참여 시 사용)
  getStudentToken: async (curriculumId, curriculumSubject, userId, userNickname) => {
    const response = await _axiosAuth.post('/token/student', {
      curriculumId,
      curriculumSubject,
      userId,
      userNickname,
    });
    return response.data.token;
  },

  // 라이브 방 목록 조회
  getRoomList: async () => {
    const response = await _axios.get('/rooms');
    return response.data;
  },

  getRoomListTop4: async () => {
    const response = await _axios.get('/rooms/top4');
    return response.data;
  },
};

// React Query를 사용한 방 목록 자동 갱신 Hook
const useRoomList = () => {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: liveApi.getRoomList,
    refetchInterval: 5000, // - 5초마다 자동으로 방 목록 업데이트
    staleTime: 1000 * 60, // - 1분간 최신 데이터 유지
  });
};

const useRoomListTop4 = () => {
  return useQuery({
    queryKey: ['roomsTop4'],
    queryFn: liveApi.getRoomListTop4,
  });
};

// 방 종료 함수
const endLive = async () => {};

// 라이브 입장 함수
// roomId: 커리큘럼 id
// userId: 사용자 id
const joinLive = async (roomId, userId) => {
  try {
    const response = await _axiosAuth.post(`${LIVE_JOIN_STATUS_URL}/${roomId}/join/${userId}`);
    return response.data;
  } catch (error) {
    console.error('라이브 입장 실패:', error);
    throw error;
  }
};

// 라이브 퇴장 함수
// roomId: 커리큘럼 id
// userId: 사용자 id
const leaveLive = async (roomId, userId) => {
  try {
    const response = await _axiosAuth.post(`${LIVE_JOIN_STATUS_URL}/${roomId}/leave/${userId}`);
    return response.data;
  } catch (error) {
    console.error('라이브 퇴장 실패:', error);
    throw error;
  }
};

// 라이브 참여자 수 조회 함수
// roomId: 커리큘럼 id
const getLiveCount = async (roomId) => {
  try {
    const response = await _axiosAuth.get(`${LIVE_JOIN_STATUS_URL}/${roomId}/count`);
    return response.data;
  } catch (error) {
    console.error('참여자 수 조회 실패:', error);
    throw error;
  }
};

const InstructorLeaveLive = async (curriculumId, userId) => {
  try {
    const response = await _axiosAuth.post('/live/leave/instructor', {
      curriculumId,
      userId,
    });
    return response.data;
  } catch (error) {
    console.error('강사 라이브 퇴장 실패:', error);
    throw error;
  }
};

export {
  endLive,
  getLiveCount,
  InstructorLeaveLive,
  joinLive,
  leaveLive,
  liveApi,
  useRoomList,
  useRoomListTop4,
};
