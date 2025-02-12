import { useEffect, useRef } from 'react';

export const AudioComponent = ({ track }) => {
  const audioElement = useRef(null);

  useEffect(() => {
    if (audioElement.current) {
      track.attach(audioElement.current);
    }

    return () => {
      track.detach();
    };
  }, [track]);

  return <audio ref={audioElement} id={track.sid} />;
};
