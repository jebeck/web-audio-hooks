import { useEffect, useRef } from 'react';

export const MIN_GAIN = 0.00001;
export const RAMP_TIME = 0.05;

export function useGain({ audioCtx, destination, ...options }) {
  const gainNodeRef = useRef();

  function getGain() {
    if (!gainNodeRef.current) {
      /** [MDN] You shouldn't manually create a gain node; instead, use the method AudioContext.createGain(). */
      gainNodeRef.current = audioCtx.createGain();
    }
    return gainNodeRef.current;
  }

  useEffect(() => {
    console.log('useGain: connect to target');
    let target = destination || audioCtx.destination;
    getGain().connect(target);

    return () => {
      getGain().disconnect(target);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination]);

  useEffect(() => {
    console.log('useGain: update gain');
    const gainNode = getGain();
    if (
      gainNode &&
      options?.gain != null &&
      gainNode.gain.value !== options?.gain
    ) {
      /** gain cannot be 0 exactly, tho it can be negative */
      const valueToSet = options?.gain === 0 ? MIN_GAIN : options?.gain;
      /** [MDN] Never change the value directly but use the exponential interpolation methods on the AudioParam interface. */
      gainNode.gain.setTargetAtTime(
        valueToSet,
        audioCtx.currentTime,
        RAMP_TIME
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.gain]);

  return { gainNode: getGain() };
}
