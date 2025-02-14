/** @jsxImportSource react */
import '@/styles/live.css';

import { Chat } from '@livekit/components-react';
import { useEffect } from 'react';

import { RightArrowIcon } from '@/components/common/icons';

export const CustomChat = ({
  onLeave,
  isCreator,
  isVisible,
  setIsVisible,
  curriculumSubject,
  ...props
}) => {
  const applyMessageStyles = () => {
    const entries = document.querySelectorAll('.lk-chat-entry');
    entries.forEach((entry) => {
      // 이름에서 'chat ' 접두사 제거
      const nameElement = entry.querySelector('.lk-participant-name');
      if (nameElement && nameElement.textContent.startsWith('chat ')) {
        nameElement.textContent = nameElement.textContent.substring(5);
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
        <h2 className="mb-4 text-xl font-bold">
          <span className="text-primary-color">{curriculumSubject}</span>
        </h2>
        {/* 퇴장 버튼과 토글 버튼 컨테이너 */}
        <div className="header-buttons-container mb-4 flex items-center gap-2">
          <button className="toggle-chat-btn" onClick={() => setIsVisible(false)}>
            <RightArrowIcon />
          </button>
          <button
            onClick={onLeave}
            className="flex-1 rounded-lg bg-primary-color px-6 py-2 text-white hover:opacity-90"
          >
            {isCreator ? '라이브 종료' : '라이브 퇴장'}
          </button>
        </div>
        <Chat {...props} />
      </div>
    </div>
  );
};
