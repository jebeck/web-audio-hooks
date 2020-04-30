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
  }, [options]);

  useEffect(() => {
    if (
      analyserNodeRef.current &&
      options?.maxDecibels &&
      analyserNodeRef.current.maxDecibels !== options?.maxDecibels
    ) {
      analyserNodeRef.current.maxDecibels = options?.maxDecibels;
    }
  }, [options]);

  useEffect(() => {
    if (
      analyserNodeRef.current &&
      options?.minDecibels &&
      analyserNodeRef.current.minDecibels !== options?.minDecibels
    ) {
      analyserNodeRef.current.minDecibels = options?.minDecibels;
    }
  }, [options]);

  useEffect(() => {
    if (
      analyserNodeRef.current &&
      options?.smoothingTimeConstant &&
      analyserNodeRef.current.smoothingTimeConstant !==
        options?.smoothingTimeConstant
    ) {
      analyserNodeRef.current.smoothingTimeConstant =
        options?.smoothingTimeConstant;
    }
  }, [options]);

  return {
    getAnalyser,
  };
}
