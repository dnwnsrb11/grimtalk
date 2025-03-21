import { useMutation, useQuery } from '@tanstack/react-query';

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
    const response = await _axios.get(`/rooms`);
    return response.data;
  },

  getRoomListTop4: async () => {
    const response = await _axios.get(`/rooms/top4`);
    return response.data;
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

  checkLive: async (curriculumId) => {
    try {
      const response = await _axiosAuth.get(`/curriculum/check-live/${curriculumId}`);
      return response.data.body.data.liveStatus;
    } catch (error) {
      console.error('라이브 상태 조회 실패:', error);
      throw error;
    }
  },
};

// 라이브 방 목록 조회
const useRoomList = () => {
  return useQuery({
    queryKey: ['rooms'], // userId를 키에 포함
    queryFn: () => liveApi.getRoomList(), // userId 전달
  });
};

const useRoomListTop4 = () => {
  return useQuery({
    queryKey: ['roomsTop4'],
    queryFn: () => liveApi.getRoomListTop4(),
  });
};

// React Query를 사용한 방 목록 자동 갱신 Hook
const useFavoriteRoomList = (userId, isLogin = false) => {
  return useQuery({
    queryKey: ['rooms', userId],
    queryFn: () => (isLogin ? liveApi.getFavoriteRoomList(userId) : liveApi.getRoomList()),
  });
};

const useFavoriteRoomListTop4 = (userId, isLogin = false) => {
  return useQuery({
    queryKey: ['roomsTop4', userId],
    queryFn: () => (isLogin ? liveApi.getFavoriteRoomListTop4(userId) : liveApi.getRoomListTop4()),
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

// 강사 스트로크 저장을 위한 커스텀 훅
const useAddStrokeMutation = (roomId) => {
  return useMutation({
    mutationFn: async (strokeData) => {
      // mutationFn에서 파라미터로 받음
      const { data } = await _axiosAuth.post(`/stroke/${roomId}`, strokeData);
      console.log(strokeData);
      return data;
    },
    onError: (error) => {
      console.error('스트로크 저장 실패:', error);
    },
    onSuccess: (data) => {
      console.log('스트로크 저장 성공:', data);
    },
  });
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
    if (response.data === 0) {
      return 0;
    }
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
    refetchInterval: 10000, // 10초마다 데이터 갱신
    staleTime: 1000 * 10, // 10초 동안 데이터 유지
  });
};

const InstructorLeaveLive = async (curriculumId, userId) => {
  try {
    const response = await _axiosAuth.post('/live/leave/instructor', {
      curriculumId,
      userId,
      isLive: false,
    });
    return response.data;
  } catch (error) {
    console.error('강사 라이브 퇴장 실패:', error);
    throw error;
  }
};

// 강사 이미지 추출 함수
const InstructorExportImage = async (formData) => {
  try {
    const response = await _axiosAuth.post(`/curriculum/completed-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('강사 이미지 추출 실패:', error);
    throw error;
  }
};

const useCheckLive = (curriculumId, enabled = false) => {
  return useQuery({
    queryKey: ['checkLive', curriculumId],
    queryFn: () => liveApi.checkLive(curriculumId),
    enabled: !!curriculumId && enabled, // curriculumId가 있고 enabled가 true일 때만 쿼리 실행
    refetchInterval: 5000, // 5초마다 데이터 갱신
  });
};

export {
  endLive,
  InstructorExportImage,
  InstructorLeaveLive,
  joinLive,
  leaveLive,
  liveApi,
  useAddStrokeMutation,
  useCheckLive,
  useFavoriteRoomList,
  useFavoriteRoomListTop4,
  useLiveCount,
  useRoomList,
  useRoomListTop4,
};
