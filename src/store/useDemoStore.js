import { create } from 'zustand';

/**
 * Zustand Store 작성 가이드
 * https://zustand.docs.pmnd.rs/getting-started/introduction
 *
 * 1. 네이밍 규칙
 * - use[Domain]Store 형식을 사용합니다 (예: useAuthStore, useCartStore)
 * - 도메인/기능별로 Store를 분리합니다
 *
 * 2. Store 구조
 * - 상태(state): 저장할 데이터
 * - 액션(actions): 상태를 변경하는 함수
 *
 * 3. 사용 시 주의사항
 * - 컴포넌트에서 사용할 때는 필요한 상태만 선택적으로 import하세요 (성능 최적화)
 * - 예: const bears = useDemoStore(state => state.bears)
 *
 * 4. 주의사항
 * - Store를 너무 많이 만들지 않기 (전역 상태 관리는 최소화, 만들기 전 회의 필요)
 * - 관련 있는 상태들은 하나의 Store로 관리
 * - 명확한 책임 분리
 */

export const useDemoStore = create((set) => ({
  // 상태 (States)
  bears: 0,

  // 액션 (Actions)
  // set 함수를 통해 상태를 업데이트합니다
  // 1. 이전 상태를 참조하는 경우: set((state) => ({ ... }))
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),

  // 2. 이전 상태가 필요없는 경우: set({ ... })
  removeAllBears: () => set({ bears: 0 }),

  // 3. 매개변수가 필요한 경우
  updateBears: (newBears) => set({ bears: newBears }),
}));
