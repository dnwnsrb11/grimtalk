/** @jsxImportSource react */
import '@/styles/live.css';

import { Chat } from '@livekit/components-react';
import { useEffect } from 'react';

import { ParticipantCountIcon, RightArrowIcon } from '@/components/common/icons';
import { VideoComponent } from '@/components/live/VideoComponent';

// 이름을 해시화하여 색상을 생성하는 함수
const getColorFromName = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // 미리 정의된 색상 배열 (보기 좋은 색상들로 구성)
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEEAD',
    '#D4A5A5',
    '#9B59B6',
    '#3498DB',
    '#E67E22',
    '#2ECC71',
    '#1ABC9C',
    '#F1C40F',
  ];

  // 해시값을 사용하여 색상 배열에서 색상 선택
  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex];
};

export const CustomChat = ({
  onLeave,
  isCreator,
  isVisible,
  setIsVisible,
  curriculumSubject,
  track,
  participantIdentity,
  local,
  liveCount,
  ...props
}) => {
  const applyMessageStyles = () => {
    const entries = document.querySelectorAll('.lk-chat-entry');
    entries.forEach((entry) => {
      // 이름에서 'chat ' 접두사 제거
      const nameElement = entry.querySelector('.lk-participant-name');
      if (nameElement) {
        if (nameElement.textContent.startsWith('chat ')) {
          nameElement.textContent = nameElement.textContent.substring(5);
        }
        // 이름에 따른 색상 적용
        const userName = nameElement.textContent;
        nameElement.style.color = getColorFromName(userName);
      }

      // 빈 meta-data 요소 제거
      const metaDataElements = entry.querySelectorAll('.lk-meta-data');
      metaDataElements.forEach((metaData) => {
        if (!metaData.querySelector('.lk-participant-name')) {
          metaData.remove();
        }
      });

      // 기본 스타일 적용
      entry.style.display = 'flex';
      entry.style.flexDirection = 'row';
      entry.style.gap = '8px';
      entry.style.alignItems = 'center';

      // 시간 요소 제거
      const timestamp = entry.querySelector('.lk-timestamp');
      if (timestamp) {
        timestamp.remove();
      }

      // 연속된 메시지에도 이름 표시
      if (!nameElement) {
        const prevEntry = entry.previousElementSibling;
        if (prevEntry) {
          const prevName = prevEntry.querySelector('.lk-participant-name');
          if (prevName) {
            const metaData = document.createElement('span');
            metaData.className = 'lk-meta-data';
            const newName = prevName.cloneNode(true);
            // 이전 메시지의 색상을 유지
            newName.style.color = prevName.style.color;
            metaData.appendChild(newName);
            entry.insertBefore(metaData, entry.firstChild);
          }
        }
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const header = document.querySelector('.lk-chat-header');
      const input = document.querySelector('.lk-chat-form-input');
      const button = document.querySelector('.lk-chat-form-button');
      const container = document.querySelector('.lk-room-container');

      applyMessageStyles();

      if (header) {
        header.style.display = 'none';
      }
      if (input) {
        input.placeholder = '채팅을 입력해주세요.';
      }
      if (button) {
        button.textContent = '전송';
      }

      if (container) {
        container.classList.toggle('visible', isVisible);
        container.classList.toggle('hidden', !isVisible);
      }

      if (input && button) {
        clearInterval(interval);
      }
    }, 100);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          applyMessageStyles();
        }
      });
    });

    const chatMessages = document.querySelector('.lk-chat-messages');
    if (chatMessages) {
      observer.observe(chatMessages, { childList: true, subtree: true });
    }

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, [isVisible]);

  return (
    <div className="chat-container relative">
      {/* 채팅 컴포넌트 */}
      <div className={`chat-wrapper ${isVisible ? 'visible' : 'hidden'}`}>
        {/* 과목명 표시 */}
        <h2 className="mb-4 flex flex-col gap-2 text-xl font-bold">
          <span className="text-primary-color break-keep">{curriculumSubject}</span>
          <div className="flex items-center justify-end gap-1">
            <span className="text-text-gray-color flex items-center gap-2 text-sm">
              <ParticipantCountIcon />
            </span>
            <span className="text-text-gray-color text-sm">{liveCount}</span>
          </div>
        </h2>
        {/* 퇴장 버튼과 토글 버튼 컨테이너 */}
        <div className="header-buttons-container mb-4 flex items-center gap-2">
          <button className="toggle-chat-btn" onClick={() => setIsVisible(false)}>
            <RightArrowIcon />
          </button>
          <button
            onClick={onLeave}
            className="bg-primary-color flex-1 rounded-lg px-6 py-2 text-white hover:opacity-90"
          >
            <div className="flex items-center justify-center gap-2">
              {isCreator ? (
                <>
                  <div className="animate-pulse rounded-full bg-white p-1"></div>
                  <p>라이브 종료</p>
                </>
              ) : (
                <>
                  <p>라이브 퇴장</p>
                </>
              )}
            </div>
          </button>
        </div>
        {/* 비디오 컴포넌트 추가 */}
        {track && (
          <div className="mb-4">
            <VideoComponent track={track} participantIdentity={participantIdentity} local={local} />
          </div>
        )}
        <Chat {...props} />
      </div>
    </div>
  );
};
