import { useEffect, useRef } from 'react';

export function useOscillator({ audioCtx, ...options }) {
  const oscillatorNodeRef = useRef();

  function getOscillator() {
    if (!oscillatorNodeRef.current) {
      oscillatorNodeRef.current = new OscillatorNode(audioCtx, options);
    }
    return oscillatorNodeRef.current;
  }

  useEffect(() => {
    getOscillator().connect(audioCtx.destination);
    getOscillator().start();

    return () => {
      getOscillator().disconnect(audioCtx.destination);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      oscillatorNodeRef.current &&
      options?.frequency &&
      oscillatorNodeRef.current.frequency !== options.frequency
    ) {
      oscillatorNodeRef.current.frequency.setValueAtTime(
        options.frequency,
        audioCtx.currentTime
      );
    }
  }, [audioCtx.currentTime, options]);

  useEffect(() => {
    if (
      oscillatorNodeRef.current &&
      options?.type &&
      oscillatorNodeRef.current.type !== options.type
    ) {
      oscillatorNodeRef.current.type = options?.type;
    }
  });

  return { getOscillator };
}
