import { create } from 'zustand';

// 알림 상태 관리를 위한 Zustand 스토어
// SSE로 수신된 알림 데이터를 관리하고 UI에 반영하는 역할
export const useNotificationStore = create((set) => ({
  // 읽지 않은 알림 개수
  unreadCount: 0,
  // 알림 목록
  notifications: [],

  // 알림 추가
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),

  // 알림 읽음 처리
  markAsRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification,
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  // 전체 알림 읽음 처리
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        isRead: true,
      })),
      unreadCount: 0,
    })),

  // 알림 목록 설정
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }),
}));
