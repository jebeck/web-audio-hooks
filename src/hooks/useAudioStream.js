import { useEffect } from 'react';

export function useAudioStream({ audioCtx, destination }) {
  useEffect(() => {
    const target = destination || audioCtx.destination;
    navigator.mediaDevices.getUserMedia({ audio: true }).then((userStream) => {
      const stream = audioCtx.createMediaStreamSource(userStream);
      stream.connect(target);
    });
  }, [audioCtx, destination]);
}
