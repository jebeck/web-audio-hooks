import { useEffect, useRef } from 'react';

export function useDelay({ audioCtx, destination, ...options }) {
  const delayNodeRef = useRef();

  function getDelay() {
    if (!delayNodeRef.current) {
      delayNodeRef.current = new DelayNode(audioCtx, options);
    }
    return delayNodeRef.current;
  }

  useEffect(() => {
    let target = destination || audioCtx.destination;
    getDelay().connect(target);

    return () => {
      getDelay().disconnect(target);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination]);

  useEffect(() => {
    const delayNode = getDelay();
    if (
      delayNode &&
      options?.delayTime != null &&
      options?.delayTime !== delayNode?.delayTime.value
    ) {
      delayNode.delayTime.setValueAtTime(
        options?.delayTime,
        audioCtx.currentTime
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  return { delayNode: getDelay() };
}
