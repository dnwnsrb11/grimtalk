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

  // 라이브 즐겨찾기 유/무 방 목록 조회
  getFavoriteRoomList: async (userId) => {
    const response = await _axios.get(`/rooms/v2`, {
      params: { userId },
    });
    return response.data;
  },

  getFavoriteRoomListTop4: async (userId) => {
    const response = await _axios.get(`/rooms/top4/v2`, {
      params: { userId },
    });
    return response.data;
  },
};

// React Query를 사용한 방 목록 자동 갱신 Hook
const useFavoriteRoomList = (userId) => {
  return useQuery({
    queryKey: ['rooms', userId], // userId를 키에 포함
    queryFn: () => liveApi.getFavoriteRoomList(userId), // userId 전달
    refetchInterval: 5000,
    staleTime: 1000 * 60,
  });
};

const useFavoriteRoomListTop4 = (userId) => {
  return useQuery({
    queryKey: ['roomsTop4', userId],
    queryFn: () => liveApi.getFavoriteRoomListTop4(userId),
    refetchInterval: 5000,
    staleTime: 1000 * 60,
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
    return response.data - 1; // 방장 제외
  } catch (error) {
    console.error('참여자 수 조회 실패:', error);
    throw error;
  }
};

const useLiveCount = (roomId) => {
  return useQuery({
    queryKey: ['liveCount', roomId],
    queryFn: () => getLiveCount(roomId),
  });
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
  InstructorLeaveLive,
  joinLive,
  leaveLive,
  liveApi,
  useFavoriteRoomList,
  useFavoriteRoomListTop4,
  useLiveCount,
};
