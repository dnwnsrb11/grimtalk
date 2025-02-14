import '@/components/live/VideoComponent.css';

import { useEffect, useRef } from 'react';

export const VideoComponent = ({ track, participantIdentity, local = false }) => {
  const videoElement = useRef(null);

  useEffect(() => {
    if (videoElement.current) {
      track.attach(videoElement.current);
    }

    return () => {
      track.detach();
    };
  }, [track]);

  return (
    <div id={'camera-' + participantIdentity} className="video-container">
      <div className="participant-data">
        {/* 방장 이름 표시 */}
        {/* <p>{participantIdentity + (local ? ' (You)' : '')}</p>  */}
      </div>
      <video ref={videoElement} id={track.sid}></video>
    </div>
  );
};
