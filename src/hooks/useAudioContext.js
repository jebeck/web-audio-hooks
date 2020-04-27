import { useEffect, useRef, useState } from 'react';

export function useAudioContext() {
  const audioCtxRef = useRef();
  const [isCurrentlyPlaying, setIsCurrentlyPlayin] = useState(false);

  function getContext() {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  }

  function pause() {
    getContext().suspend();
  }

  function play() {
    getContext().resume();
  }

  useEffect(() => {
    getContext().onstatechange = () => {
      setIsCurrentlyPlayin(getContext().state === 'running');
    };
    /** auto-play is very rude; Firefox does not implement audioCtx.state, so just always suspend initially */
    getContext().suspend();

    return () => {
      getContext().close();
    };
  }, []);

  return { getContext, isCurrentlyPlaying, pause, play };
}
