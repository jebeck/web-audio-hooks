import { useEffect, useRef } from 'react';

export function useAnalyser({ audioCtx, destination, ...options }) {
  const analyserNodeRef = useRef();

  function getAnalyser() {
    if (!analyserNodeRef.current) {
      analyserNodeRef.current = audioCtx.createAnalyser();
    }
    return analyserNodeRef.current;
  }

  useEffect(() => {
    let target = destination || audioCtx.destination;
    getAnalyser().connect(target);

    return () => {
      getAnalyser().disconnect(target);
    };
  });

  useEffect(() => {
    if (
      analyserNodeRef.current &&
      options?.fftSize &&
      analyserNodeRef.current.fftSize !== options?.fftSize
    ) {
      analyserNodeRef.current.fftSize = options?.fftSize;
    }
  });

  return {
    getAnalyser,
  };
}
