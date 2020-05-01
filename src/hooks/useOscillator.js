import { useEffect, useRef, useState } from 'react';

/** TODO: support custom-type waveforms via setPeriodicWave */

export function useOscillator({ audioCtx, destination, ...options }) {
  const oscillatorNodeRef = useRef();
  const [isOscillating, setIsOscillating] = useState(false);

  function getOscillator() {
    if (!oscillatorNodeRef.current) {
      oscillatorNodeRef.current = new OscillatorNode(audioCtx, options);
    }
    return oscillatorNodeRef.current;
  }

  useEffect(() => {
    let target = destination || audioCtx.destination;
    getOscillator().connect(target);
    getOscillator().start();

    return () => {
      getOscillator().disconnect(target);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      oscillatorNodeRef.current &&
      options?.detune != null &&
      oscillatorNodeRef.current.detune !== options.detune
    ) {
      oscillatorNodeRef.current.detune.setValueAtTime(
        options.detune,
        audioCtx.currentTime
      );
    }
  }, [audioCtx.currentTime, options]);

  useEffect(() => {
    if (
      oscillatorNodeRef.current &&
      options?.frequency != null &&
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

  function startNote() {
    getOscillator().start();
    setIsOscillating(true);
  }

  function stopNote() {
    getOscillator().stop();
  }

  useEffect(() => {
    getOscillator().onended = () => {
      setIsOscillating(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { getOscillator, isOscillating, startNote, stopNote };
}
