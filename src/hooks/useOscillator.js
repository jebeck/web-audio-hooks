import { useEffect, useRef } from 'react';

import { MIN_GAIN, RAMP_TIME } from './useGain';

/** TODO: support custom-type waveforms via setPeriodicWave */

function noteOn(
  audioCtx,
  gainNode,
  {
    attack = RAMP_TIME,
    decay = RAMP_TIME,
    duration = 0,
    sustain = 1,
    release = 1,
  }
) {
  console.log('useOscillator: noteOn');
  gainNode.gain.setTargetAtTime(1, audioCtx.currentTime, attack);
  gainNode.gain.setTargetAtTime(sustain, audioCtx.currentTime, decay);
  if (duration) {
    setTimeout(() => {
      gainNode.gain.setTargetAtTime(MIN_GAIN, audioCtx.currentTime, release);
    }, [duration]);
  }
}

function noteOff(audioCtx, gainNode, { release = RAMP_TIME }) {
  console.log('useOscillator: noteOff');
  gainNode.gain.setTargetAtTime(MIN_GAIN, audioCtx.currentTime, release);
}

export function useOscillator({ audioCtx, destination, note, ...options }) {
  const oscillatorNodeRef = useRef();
  /** a gain node local to this hook control note on & off */
  const gainNodeRef = useRef();

  function getOscillator() {
    if (!oscillatorNodeRef.current) {
      oscillatorNodeRef.current = new OscillatorNode(audioCtx, options);
    }
    return oscillatorNodeRef.current;
  }

  function getGain() {
    if (!gainNodeRef.current) {
      gainNodeRef.current = audioCtx.createGain();
    }
    return gainNodeRef.current;
  }

  useEffect(() => {
    console.log('useOscillator: connect to target');
    let target = destination || audioCtx.destination;
    getOscillator().connect(getGain());
    getGain().connect(target);
    getOscillator().start(0);
    /** initialize to ~0 gain; i.e., note off */
    getGain().gain.setTargetAtTime(MIN_GAIN, audioCtx.currentTime, RAMP_TIME);

    return () => {
      getOscillator().disconnect(target);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination]);

  useEffect(() => {
    console.log('useOscillator: update detune');
    const oscillator = getOscillator();
    if (
      oscillator &&
      options?.detune != null &&
      oscillator.detune !== options.detune
    ) {
      oscillator.detune.setValueAtTime(options.detune, audioCtx.currentTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.detune]);

  useEffect(() => {
    const oscillator = getOscillator();
    if (
      oscillator &&
      options?.frequency != null &&
      oscillator.frequency !== options.frequency
    ) {
      console.log('useOscillator: update frequency');
      oscillator.frequency.setValueAtTime(
        options.frequency,
        audioCtx.currentTime
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.frequency]);

  useEffect(() => {
    console.log('useOscillator: update type');
    const oscillator = getOscillator();
    if (oscillator && options?.type && oscillator.type !== options.type) {
      oscillator.type = options?.type;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.type]);

  useEffect(() => {
    if (note) {
      noteOn(audioCtx, getGain(), note);
    } else {
      noteOff(audioCtx, getGain(), {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note]);

  return {
    oscillatorNode: getOscillator(),
  };
}
