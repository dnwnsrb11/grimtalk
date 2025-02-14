import { useMutation, useQuery } from '@tanstack/react-query';

import { _axiosAuth } from '@/api/instance';

// LiveKit 관련 API 호출 모음
const liveApi = {
  // 강사용 토큰 발급 (방 생성 시 사용)
  getInstructorToken: async (curriculumSubject, userNickname) => {
    const response = await _axiosAuth.post('/token/instructor', {
      curriculumId: 1,
      curriculumSubject,
      userId: 1,
      userNickname,
      isLive: true,
    });
    return response.data.token;
  },

  // 학생용 토큰 발급 (방 참여 시 사용)
  getStudentToken: async (curriculumSubject, userNickname) => {
    const response = await _axiosAuth.post('/token/student', {
      curriculumId: 1,
      curriculumSubject,
      userId: 1,
      userNickname,
    });
    return response.data.token;
  },

  // 라이브 방 목록 조회
  getRoomList: async () => {
    const response = await _axiosAuth.get('/memory/rooms');
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

// 방 종료 함수
const endLive = async () => {};

// 방 나가기 함수
const leaveRoom = async () => {
  const response = await _axiosAuth.post('/openvidu/live/leave');
  return response.data;
};

// 강사 스트로크 저장을 위한 커스텀 훅
const useAddStrokeMutation = (roomId, strokeData) => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await _axiosAuth.post(`/stroke/${roomId}`, strokeData);
      return data;
    },
    onError: (error) => {
      console.error('스트로크 저장 실패:', error);
      // 에러 처리 로직 추가 가능
    },
    onSuccess: (data) => {
      console.log('스트로크 저장 성공:', data);
      // 성공 후 처리 로직 추가 가능
    },
  });
};

export { endLive, leaveRoom, liveApi, useAddStrokeMutation, useRoomList };
