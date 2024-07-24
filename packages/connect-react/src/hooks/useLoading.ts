import { useEffect, useRef, useState } from 'react';

const LOADING_ANIMATION_TIMEOUT = 200;

const useLoading = () => {
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isInitialLoadingStarted, setIsInitialLoadingStarted] = useState(false);

  const finishLoading = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsInitialLoadingStarted(true);
    setLoading(false);
  };

  const startLoading = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsInitialLoadingStarted(true);
      setLoading(true);
    }, LOADING_ANIMATION_TIMEOUT);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { loading, finishLoading, startLoading, isInitialLoadingStarted: isInitialLoadingStarted };
};

export default useLoading;
