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
    const oscillator = getOscillator();
    if (
      oscillator &&
      options?.detune != null &&
      oscillator.detune !== options.detune
    ) {
      oscillator.detune.setValueAtTime(options.detune, audioCtx.currentTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioCtx.currentTime, options]);

  useEffect(() => {
    const oscillator = getOscillator();
    if (
      oscillator &&
      options?.frequency != null &&
      oscillator.frequency !== options.frequency
    ) {
      oscillator.frequency.setValueAtTime(
        options.frequency,
        audioCtx.currentTime
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioCtx.currentTime, options]);

  useEffect(() => {
    const oscillator = getOscillator();
    if (oscillator && options?.type && oscillator.type !== options.type) {
      oscillator.type = options?.type;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

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
