/** @jsxImportSource react */
import '@/styles/live.css';

import { Chat } from '@livekit/components-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';

import { ParticipantCountIcon, RightArrowIcon, SendIcon } from '@/components/common/icons';
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
  stopRecording,
  startRecording,
  sendDataButton,
  elapsedTime,
  isRecording,
  completeRecording,
  isLeaveDialogOpen,
  sendData,
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

        // isCreator가 true이고 userName이 participantIdentity와 일치하면 크라운 아이콘 추가
        if (isCreator && userName === participantIdentity) {
          const crownContainer = document.createElement('span');
          crownContainer.style.display = 'inline-flex';
          crownContainer.style.alignItems = 'center';
          crownContainer.style.marginLeft = '4px';
          const nameColor = getColorFromName(userName);
          crownContainer.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_iconCarrier">
              <path d="M19.8706 12.3884L19.1249 12.3082V12.3082L19.8706 12.3884ZM19.6872 14.0931L20.4329 14.1733V14.1733L19.6872 14.0931ZM4.3128 14.0931L3.5671 14.1733L4.3128 14.0931ZM4.12945 12.3884L4.87514 12.3082L4.12945 12.3884ZM8.76006 10.934L9.41507 11.2993L8.76006 10.934ZM10.5495 7.7254L9.89453 7.36008L10.5495 7.7254ZM13.4505 7.7254L12.7954 8.09071L13.4505 7.7254ZM15.2399 10.934L15.895 10.5686V10.5686L15.2399 10.934ZM16.0038 11.9592L15.7015 12.6456L15.7015 12.6456L16.0038 11.9592ZM17.4705 11.2451L16.9412 10.7138L17.4705 11.2451ZM16.4533 12.0219L16.3506 11.2789L16.3506 11.2789L16.4533 12.0219ZM6.5295 11.2451L6.0002 11.7765L6.5295 11.2451ZM7.5467 12.0219L7.64943 11.2789L7.64943 11.2789L7.5467 12.0219ZM7.99621 11.9592L8.29846 12.6456L8.29846 12.6456L7.99621 11.9592ZM5.71208 20.1532L6.21228 19.5943H6.21228L5.71208 20.1532ZM18.2879 20.1532L17.7877 19.5943L18.2879 20.1532ZM18.8645 9.98013L19.432 9.48982L18.8645 9.98013ZM12.9077 6.78265L12.5668 6.11457L12.9077 6.78265ZM11.0923 6.78265L11.4332 6.11457L11.0923 6.78265ZM19.1249 12.3082L18.9415 14.0129L20.4329 14.1733L20.6163 12.4686L19.1249 12.3082ZM13.0879 20.25H10.9121V21.75H13.0879V20.25ZM5.0585 14.0129L4.87514 12.3082L3.38375 12.4686L3.5671 14.1733L5.0585 14.0129ZM9.41507 11.2993L11.2046 8.09072L9.89453 7.36008L8.10504 10.5686L9.41507 11.2993ZM12.7954 8.09071L14.5849 11.2993L15.895 10.5686L14.1055 7.36008L12.7954 8.09071ZM14.5849 11.2993C14.7467 11.5893 14.8956 11.8582 15.0399 12.0638C15.1885 12.2753 15.3911 12.5089 15.7015 12.6456L16.306 11.2728C16.3619 11.2973 16.3524 11.3226 16.2675 11.2018C16.1784 11.0749 16.0727 10.8873 15.895 10.5686L14.5849 11.2993ZM16.9412 10.7138C16.6825 10.9715 16.529 11.1231 16.4082 11.2208C16.2931 11.3139 16.2906 11.2872 16.3506 11.2789L16.556 12.7648C16.8918 12.7184 17.1507 12.5495 17.3517 12.3869C17.547 12.2289 17.7642 12.0112 17.9998 11.7765L16.9412 10.7138ZM15.7015 12.6456C15.9698 12.7637 16.2657 12.8049 16.556 12.7648L16.3506 11.2789C16.3353 11.281 16.3199 11.2789 16.306 11.2728L15.7015 12.6456ZM6.0002 11.7765C6.23578 12.0112 6.453 12.2289 6.64834 12.3869C6.84933 12.5495 7.10824 12.7184 7.44397 12.7648L7.64943 11.2789C7.70944 11.2872 7.7069 11.3139 7.5918 11.2208C7.47104 11.1231 7.31753 10.9715 7.05879 10.7138L6.0002 11.7765ZM8.10504 10.5686C7.92732 10.8873 7.82158 11.0749 7.7325 11.2018C7.64765 11.3226 7.63814 11.2973 7.69395 11.2728L8.29846 12.6456C8.60887 12.5089 8.81155 12.2753 8.96009 12.0638C9.10441 11.8583 9.2533 11.5893 9.41507 11.2993L8.10504 10.5686ZM7.44397 12.7648C7.73429 12.8049 8.03016 12.7637 8.29846 12.6456L7.69395 11.2728C7.68011 11.2789 7.66466 11.281 7.64943 11.2789L7.44397 12.7648ZM10.9121 20.25C9.47421 20.25 8.46719 20.2486 7.69857 20.1502C6.9509 20.0545 6.52851 19.8774 6.21228 19.5943L5.21187 20.712C5.84173 21.2758 6.60137 21.522 7.50819 21.6381C8.39406 21.7514 9.51399 21.75 10.9121 21.75V20.25ZM3.5671 14.1733C3.71526 15.5507 3.83282 16.8999 4.03322 17.994C4.1343 18.5459 4.26178 19.0659 4.43833 19.5172C4.61339 19.9648 4.8549 20.3925 5.21187 20.712L6.21228 19.5943C6.0962 19.4904 5.96405 19.3 5.83525 18.9708C5.70795 18.6454 5.60138 18.2299 5.50868 17.7238C5.32149 16.7018 5.21246 15.4443 5.0585 14.0129L3.5671 14.1733ZM18.9415 14.0129C18.7875 15.4443 18.6785 16.7018 18.4913 17.7238C18.3986 18.2299 18.292 18.6454 18.1647 18.9708C18.036 19.3 17.9038 19.4904 17.7877 19.5943L18.7881 20.712C19.1451 20.3925 19.3866 19.9648 19.5617 19.5172C19.7382 19.0659 19.8657 18.5459 19.9668 17.994C20.1672 16.8999 20.2847 15.5507 20.4329 14.1733L18.9415 14.0129ZM13.0879 21.75C14.486 21.75 15.6059 21.7514 16.4918 21.6381C17.3986 21.522 18.1583 21.2758 18.7881 20.712L17.7877 19.5943C17.4715 19.8774 17.0491 20.0545 16.3014 20.1502C15.5328 20.2486 14.5258 20.25 13.0879 20.25V21.75ZM10.75 5C10.75 4.30964 11.3096 3.75 12 3.75V2.25C10.4812 2.25 9.25 3.48122 9.25 5H10.75ZM12 3.75C12.6904 3.75 13.25 4.30964 13.25 5H14.75C14.75 3.48122 13.5188 2.25 12 2.25V3.75ZM20.75 9C20.75 9.41421 20.4142 9.75 20 9.75V11.25C21.2426 11.25 22.25 10.2426 22.25 9H20.75ZM19.25 9C19.25 8.58579 19.5858 8.25 20 8.25V6.75C18.7574 6.75 17.75 7.75736 17.75 9H19.25ZM20 8.25C20.4142 8.25 20.75 8.58579 20.75 9H22.25C22.25 7.75736 21.2426 6.75 20 6.75V8.25ZM4 9.75C3.58579 9.75 3.25 9.41421 3.25 9H1.75C1.75 10.2426 2.75736 11.25 4 11.25V9.75ZM3.25 9C3.25 8.58579 3.58579 8.25 4 8.25V6.75C2.75736 6.75 1.75 7.75736 1.75 9H3.25ZM4 8.25C4.41421 8.25 4.75 8.58579 4.75 9H6.25C6.25 7.75736 5.24264 6.75 4 6.75V8.25ZM20 9.75C19.997 9.75 19.994 9.74998 19.991 9.74995L19.9736 11.2498C19.9824 11.2499 19.9912 11.25 20 11.25V9.75ZM20.6163 12.4686C20.6646 12.0187 20.707 11.6258 20.7302 11.298C20.753 10.9769 20.7616 10.6689 20.7256 10.4003L19.2389 10.5995C19.2536 10.7093 19.2553 10.8908 19.234 11.192C19.2131 11.4865 19.1743 11.8486 19.1249 12.3082L20.6163 12.4686ZM19.991 9.74995C19.7681 9.74737 19.5689 9.64827 19.432 9.48982L18.2969 10.4704C18.703 10.9405 19.3032 11.2421 19.9736 11.2498L19.991 9.74995ZM19.432 9.48982C19.3181 9.35799 19.25 9.18789 19.25 9H17.75C17.75 9.56143 17.9566 10.0765 18.2969 10.4704L19.432 9.48982ZM17.9998 11.7765C18.6773 11.1017 19.0262 10.7616 19.2584 10.6183L18.4705 9.34191C18.0506 9.60109 17.547 10.1103 16.9412 10.7138L17.9998 11.7765ZM4.75 9C4.75 9.18789 4.68188 9.35799 4.56799 9.48982L5.70307 10.4704C6.0434 10.0765 6.25 9.56143 6.25 9H4.75ZM7.05879 10.7138C6.45296 10.1103 5.94936 9.60109 5.52946 9.34191L4.7416 10.6183C4.97377 10.7616 5.32273 11.1017 6.0002 11.7765L7.05879 10.7138ZM4.56799 9.48982C4.4311 9.64827 4.23192 9.74737 4.00904 9.74995L4.02639 11.2498C4.69676 11.2421 5.29701 10.9405 5.70307 10.4704L4.56799 9.48982ZM4.00904 9.74995C4.00602 9.74998 4.00301 9.75 4 9.75V11.25C4.00881 11.25 4.01761 11.2499 4.02639 11.2498L4.00904 9.74995ZM4.87514 12.3082C4.82571 11.8486 4.78687 11.4865 4.76601 11.192C4.74467 10.8908 4.74636 10.7093 4.76107 10.5995L3.27435 10.4003C3.23837 10.6689 3.24701 10.9769 3.26976 11.298C3.29298 11.6258 3.33535 12.0187 3.38375 12.4686L4.87514 12.3082ZM13.25 5C13.25 5.48504 12.9739 5.90689 12.5668 6.11457L13.2485 7.45073C14.1381 6.99685 14.75 6.07053 14.75 5H13.25ZM12.5668 6.11457C12.3975 6.20095 12.2056 6.25 12 6.25V7.75C12.448 7.75 12.873 7.6423 13.2485 7.45073L12.5668 6.11457ZM14.1055 7.36008C13.8992 6.9902 13.7138 6.65746 13.5437 6.3852L12.2716 7.1801C12.4176 7.41372 12.5828 7.70948 12.7954 8.09071L14.1055 7.36008ZM12 6.25C11.7944 6.25 11.6025 6.20095 11.4332 6.11457L10.7515 7.45073C11.127 7.6423 11.552 7.75 12 7.75V6.25ZM11.4332 6.11457C11.0261 5.90689 10.75 5.48504 10.75 5H9.25C9.25 6.07053 9.86186 6.99685 10.7515 7.45073L11.4332 6.11457ZM11.2046 8.09072C11.4172 7.70948 11.5824 7.41372 11.7284 7.1801L10.4563 6.3852C10.2862 6.65746 10.1008 6.9902 9.89453 7.36008L11.2046 8.09072Z" fill="#F1C40F"/>
              <path d="M5 17.5H19" stroke="#F1C40F" stroke-width="1.5" stroke-linecap="round"/>
            </g>
          </svg>`;
          nameElement.appendChild(crownContainer);
        }
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
      {/* 강사의 경우에만 보임 */}
      {isCreator && (
        <div className="group relative">
          <div className="relative flex items-center justify-between gap-2">
            <div className="relative">
              {/* 경고 테두리 애니메이션 - 버튼만 감싸도록 수정 */}

              {/* 녹화 버튼들 */}
              <div
                className={`relative z-10 ${isLeaveDialogOpen ? 'animate-[pulse_1.0s_ease-in-out_infinite]' : ''}`}
              >
                {isRecording ? (
                  <button
                    onClick={stopRecording}
                    className="relative rounded-lg border bg-[#EFEFEF] px-[10px] py-[5px] transition-colors duration-200 hover:bg-[#cfcfcf]"
                  >
                    정지
                  </button>
                ) : (
                  !completeRecording && (
                    <button
                      onClick={startRecording}
                      className="relative rounded-lg border bg-[#FF5C38] px-[10px] py-[5px] text-white transition-colors duration-200 hover:bg-[#fc7051]"
                    >
                      녹화
                    </button>
                  )
                )}
                {completeRecording && (
                  <AnimatePresence>
                    {!sendData ? (
                      <motion.button
                        onClick={sendDataButton}
                        initial={{ x: 0, opacity: 1 }}
                        exit={{ x: 100, opacity: 0 }}
                        className="relative rounded-lg border bg-[#FF5C38] px-[10px] py-[5px] text-white hover:bg-[#fc7051]"
                      >
                        저장
                      </motion.button>
                    ) : (
                      <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        <div className="rounded-lg bg-black px-[10px] py-[5px] text-white">
                          <SendIcon width={20} height={20} fill="white" />
                        </div>
                        <span className=" text-black">저장됨</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            </div>

            {/* 타이머 - 테두리 애니메이션 밖으로 분리 */}
            <div className="relative flex w-[30%] justify-center rounded-lg border border-[#ffb3a1] px-[20px] py-[5px]">
              <p>
                {(elapsedTime / 10).toFixed(0)}{' '}
                <span className="text-[14px] font-light text-[#828282]">초</span>{' '}
              </p>
            </div>
          </div>
          <div className="absolute mt-[5px] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <p className="whitespace-pre-line text-[14px] leading-tight text-[#C1C1C1]">
              녹화를 통하여 다시보기에 업로드가 {'\n'}가능합니다.
            </p>
          </div>
          <hr className="my-2 transition-[margin] duration-300 ease-in-out group-hover:mt-[50px]" />
        </div>
      )}
      {/* 채팅 컴포넌트 */}
      <div className={`chat-wrapper ${isVisible ? 'visible' : 'hidden'}`}>
        {/* 과목명 표시 */}
        <h2 className="mb-4 flex flex-col gap-2 text-xl font-bold">
          <span className="break-keep text-primary-color">{curriculumSubject}</span>
          <div className="flex items-center justify-end gap-1">
            <span className="flex items-center gap-2 text-sm text-text-gray-color">
              <ParticipantCountIcon />
            </span>
            <span className="text-sm text-text-gray-color">{liveCount}</span>
          </div>
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
