import { useEffect, useRef } from 'react';

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
      /** gain cannot be 0 exactly, tho it can be negative */
      const valueToSet = options?.gain === 0 ? 0.01 : options?.gain;
      /** [MDN] Never change the value directly but use the exponential interpolation methods on the AudioParam interface. */
      gainNodeRef.current.gain.exponentialRampToValueAtTime(
        valueToSet,
        audioCtx.currentTime + 1
      );
    }
  });

  return { getGain };
}
