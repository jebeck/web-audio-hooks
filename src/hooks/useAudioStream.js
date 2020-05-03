import { useEffect } from 'react';

/** TODO: component that calls navigator.mediaDevices.enumerateDevices() and renders dropdown/selection */
export function useAudioStream({ audioCtx, destination }) {
  useEffect(() => {
    const target = destination || audioCtx.destination;
    navigator.mediaDevices.getUserMedia({ audio: true }).then((userStream) => {
      const stream = audioCtx.createMediaStreamSource(userStream);
      stream.connect(target);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination]);
}
