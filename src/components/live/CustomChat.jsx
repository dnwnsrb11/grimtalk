/** @jsxImportSource react */
import { Chat } from '@livekit/components-react';
import { useEffect } from 'react';

export const CustomChat = (props) => {
  const applyMessageStyles = () => {
    const entries = document.querySelectorAll('.lk-chat-entry');
    entries.forEach((entry) => {
      // 이름에서 'chat ' 접두사 제거
      const nameElement = entry.querySelector('.lk-participant-name');
      if (nameElement && nameElement.textContent.startsWith('chat ')) {
        nameElement.textContent = nameElement.textContent.substring(5);
      }

      // 기본 스타일 적용
      entry.style.display = 'flex';
      entry.style.flexDirection = 'row';
      entry.style.gap = '8px';
      entry.style.alignItems = 'center';

      // 시간 요소 숨기기
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
  }, []);

  return <Chat {...props} />;
};
