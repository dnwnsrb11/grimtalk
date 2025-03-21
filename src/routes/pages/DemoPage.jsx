import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { useState } from 'react';

import { _axios } from '@/api/instance';
import { LoadingComponents } from '@/components/common/LoadingComponents';
import { useDemoStore } from '@/store/useDemoStore';

export const DemoPage = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(true);
  // Zustand store 활용 (로컬 상태용)
  const bears = useDemoStore((state) => state.bears);
  const updateBears = useDemoStore((state) => state.updateBears);

  // React Query를 사용하는 이유
  // 기존 방식
  // 1. useState로 데이터 상태 관리
  // 2. useEffect에서 API 호출
  // 3. 로딩/에러 상태도 직접 관리
  // 4. 여러 컴포넌트에서 같은 API 호출하면 중복 발생

  // React Query 방식
  // 1. 자동 캐싱:
  //    - 같은 데이터 또 요청하면 캐시에서 바로 가져옴
  //    - 불필요한 API 호출 줄어듦 -> 서버 부하 감소, 속도 향상

  // 2. 데이터 상태 관리 자동화:
  //    - isLoading, isError 같은 상태 자동 제공
  //    - 우리가 직접 관리할 필요 없음!

  // 3. 데이터 자동 동기화:
  //    - 백그라운드에서 데이터 최신화
  //    - 여러 컴포넌트에서 같은 데이터 사용해도 항상 최신 상태 유지

  // 4. 코드가 깔끔해져요:
  //    - 보일러플레이트(자주 반복되는 기본 코드)인 useState, useEffect 제거
  //    - 비즈니스 로직에만 집중 가능
  //    - 비즈니스 로직 예시:
  //      * 게시물 목록 조회/추가/수정/삭제
  //      * 사용자 인증/인가 처리
  //      * 상품 관리

  // 게시물 조회 쿼리
  // https://tanstack.com/query/latest/docs/framework/react/reference/useQuery
  // data를 posts라는 이름으로 변경해서 받음 (구조 분해 할당 + 이름 변경)
  // 이렇게 받은 posts는 아래 JSX에서 사용됨
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      // axios 응답에서 data 속성만 추출 (axios의 응답 구조: { data, status, headers, ... })
      const { data } = await _axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5');

      // 추출한 data를 반환하면 자동으로 useQuery의 data 속성에 저장됨
      // 이 data가 위에서 posts라는 이름으로 받아짐
      return data;
    },
  });

  // 게시물 추가 뮤테이션
  // https://tanstack.com/query/latest/docs/framework/react/reference/useMutation
  const addPostMutation = useMutation({
    mutationFn: async () => {
      const { data } = await _axios.post('https://jsonplaceholder.typicode.com/posts', {
        title: `새로운 게시물 ${bears}`,
        body: '게시물 내용',
        userId: 1,
      });
      return data;
    },
    onSuccess: (newPost) => {
      // 실제 API 통신 시 권장되는 패턴
      // 방식 1: invalidateQueries 사용
      // - 서버에 재요청하여 최신 데이터 가져옴
      // - 다른 사용자의 변경사항도 반영 가능
      // - 추가 네트워크 요청 발생
      // queryClient.invalidateQueries({ queryKey: ['posts'] });

      // 방식 2: setQueryData 사용
      // - 서버 응답에 새로운 데이터가 완전히 포함된 경우
      // - 즉시 UI 업데이트 (추가 네트워크 요청 없음)
      // - 다른 사용자의 변경사항은 반영 못함
      // queryClient.setQueryData(['posts'], (oldPosts) => {
      //   return [newPost, ...(oldPosts || [])];
      // });

      // 기존 posts 쿼리 데이터를 가져와서 새 게시물을 추가
      // 단, 이는 클라이언트 측 캐시에만 반영되며, 페이지를 새로고침하면 초기화됨(JSONPlaceholder API 특성)
      queryClient.setQueryData(['posts'], (oldPosts) => {
        return [newPost, ...(oldPosts || [])].slice(0, 5);
      });
      updateBears(bears + 1);
    },
  });

  // 로딩 여부에 따라 로딩 컴포넌트를 랜더링 - 테스트
  const check = false;
  if (check) {
    return <LoadingComponents />;
  }

  // motion 테스트
  const header = 'asdf';
  const content = '이거되냐?';

  return (
    <div className="col-span-14">
      <h1 className="text-2xl font-bold">DemoPage (React Query + Zustand)</h1>
      <div className="flex flex-col items-baseline gap-4">
        <div className="rounded border p-4">
          <h2 className="mb-2 font-bold">로컬 상태 (Zustand)</h2>
          <p>Bears 카운트: {bears}</p>
          <button
            className="mt-2 border border-gray-300 px-2 py-1"
            onClick={() => updateBears(bears + 1)}
          >
            Update Bears
          </button>
        </div>

        <div className="rounded border p-4">
          <h2 className="mb-2 font-bold">서버 상태 (React Query)</h2>
          {isLoading ? (
            <p>포스트 로딩 중...</p>
          ) : (
            <>
              <button
                className="mb-4 border border-gray-300 px-2 py-1"
                onClick={() => addPostMutation.mutate()}
                disabled={addPostMutation.isPending}
              >
                {addPostMutation.isPending ? '게시물 추가 중...' : '새 게시물 추가'}
              </button>
              {/* JSX에서 위에서 받은 posts 사용 */}
              <div className="space-y-2">
                {/* posts는 위에서 data: posts로 받은 데이터 */}
                {posts?.map((post) => (
                  <div key={post.id} className="border p-2">
                    <h3 className="font-bold">{post.title}</h3>
                    <p className="text-sm">{post.body}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <motion.div layout onClick={() => setIsOpen(!isOpen)}>
          <motion.h2 layout>{header}</motion.h2>
          {isOpen ? content : null}
        </motion.div>
      </div>
      <LoadingComponents />
    </div>
  );
};
