/** @jsxImportSource react */
import { Chat } from '@livekit/components-react';
import { useEffect } from 'react';

export const CustomChat = (props) => {
  useEffect(() => {
    const interval = setInterval(() => {
      const header = document.querySelector('.lk-chat-header');

      const input = document.querySelector('.lk-chat-form-input');
      const button = document.querySelector('.lk-chat-form-button');

      if (header) {
        header.style.display = 'none';
      }
      if (input) {
        input.placeholder = '새로운 메시지를 입력하세요...';
      }
      if (button) {
        button.textContent = '전송';
      }

      // input과 button을 찾았으면 interval 중지
      if (input && button) {
        clearInterval(interval);
      }
    }, 100);
  }, []);

  return <Chat {...props} />;
};
