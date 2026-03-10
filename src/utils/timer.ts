import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimer = (isRunning: boolean) => {
  const [elapsedMs, setElapsedMs] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const updateTimer = useCallback(() => {
    if (startTimeRef.current !== null) {
      setElapsedMs(Date.now() - startTimeRef.current);
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now() - elapsedMs;
      }
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    } else {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      startTimeRef.current = null;
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, updateTimer, elapsedMs]);

  const reset = useCallback(() => {
    setElapsedMs(0);
    startTimeRef.current = isRunning ? Date.now() : null;
  }, [isRunning]);

  return { elapsedMs, reset };
};
