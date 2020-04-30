import { useEffect, useRef } from 'react';

export function useGain({ audioCtx, destination, ...options }) {
  const gainNodeRef = useRef();

  function getGain() {
    if (!gainNodeRef.current) {
      gainNodeRef.current = audioCtx.createGain();
    }
    return gainNodeRef.current;
  }

  useEffect(() => {
    let target = destination || audioCtx.destination;
    getGain().connect(target);

    return () => {
      getGain().disconnect(target);
    };
  });

  useEffect(() => {
    if (
      gainNodeRef.current &&
      options?.gain != null &&
      gainNodeRef.current.gain.value !== options?.gain
    ) {
      gainNodeRef.current.gain.setValueAtTime(
        options?.gain,
        audioCtx.currentTime
      );
    }
  });

  return { getGain };
}
