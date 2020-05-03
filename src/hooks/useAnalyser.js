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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination]);

  useEffect(() => {
    const analyser = getAnalyser();
    if (
      analyserNodeRef.current &&
      options?.fftSize &&
      analyser.fftSize !== options?.fftSize
    ) {
      analyser.fftSize = options?.fftSize;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  useEffect(() => {
    const analyser = getAnalyser();
    if (
      analyser &&
      options?.maxDecibels &&
      analyser.maxDecibels !== options?.maxDecibels
    ) {
      analyser.maxDecibels = options?.maxDecibels;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  useEffect(() => {
    const analyser = getAnalyser();
    if (
      analyser &&
      options?.minDecibels &&
      analyser.minDecibels !== options?.minDecibels
    ) {
      analyser.minDecibels = options?.minDecibels;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  useEffect(() => {
    const analyser = getAnalyser();
    if (
      analyser &&
      options?.smoothingTimeConstant &&
      analyser.smoothingTimeConstant !== options?.smoothingTimeConstant
    ) {
      analyser.smoothingTimeConstant = options?.smoothingTimeConstant;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  return {
    analyserNode: getAnalyser(),
  };
}
