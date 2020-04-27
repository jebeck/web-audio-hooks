import { useEffect } from 'react';

export function useAudioStream(audioCtx) {
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((userStream) => {
      const stream = audioCtx.createMediaStreamSource(userStream);
      stream.connect(audioCtx.destination);
    });
  }, []);
}
