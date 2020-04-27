import { useEffect, useRef } from 'react';

export function useTimeDomainData({
  analyser,
  canvasRef,
  Worker,
  workerOptions,
}) {
  const animationFrameRef = useRef();
  const workerRef = useRef();

  function getWorker() {
    if (!workerRef.current) {
      workerRef.current = new Worker();
    }
    return workerRef.current;
  }

  function rafLoop() {
    animationFrameRef.current = requestAnimationFrame(rafLoop);

    const buffer = new ArrayBuffer(analyser.frequencyBinCount);
    const dataArray = new Uint8Array(buffer);
    analyser.getByteTimeDomainData(dataArray);
    getWorker().postMessage({ timeDomainData: buffer }, [buffer]);
  }

  useEffect(() => {
    if (canvasRef?.current) {
      console.log('transfer canvas to Worker + start rAF loop');
      const worker = getWorker();
      const offscreenCanvas = canvasRef.current.transferControlToOffscreen();
      worker.postMessage({ canvas: offscreenCanvas }, [offscreenCanvas]);

      rafLoop();

      const animationFrame = animationFrameRef.current;
      return () => {
        cancelAnimationFrame(animationFrame);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const worker = getWorker();
    worker.postMessage({ workerOptions });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workerOptions]);
}
