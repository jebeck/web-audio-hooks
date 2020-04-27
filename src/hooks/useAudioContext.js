import { useEffect } from 'react';

export function makeGetAudioCtxSingleton() {
  let ctx;

  function createAudioCtx() {
    return new AudioContext();
  }

  return () => {
    if (!ctx) {
      ctx = createAudioCtx();
    }
    return ctx;
  };
}

export function useAudioContext({ getAudioCtx }) {
  const audioCtx = getAudioCtx();

  function pause() {
    audioCtx.suspend();
  }

  function play() {
    audioCtx.resume();
  }

  useEffect(() => {
    /** auto-play is very rude; Firefox does not implement audioCtx.state, so just always suspend initially */
    audioCtx.suspend();

    return () => {
      audioCtx.close();
    };
  }, [audioCtx]);

  return { audioCtx, pause, play };
}
