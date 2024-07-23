import { useEffect, useRef, useState } from 'react';

const LOADING_ANIMATION_TIMEOUT = 100;

const useLoading = () => {
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const finishLoading = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setLoading(false);
  };

  const startLoading = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
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

  return { loading, finishLoading, startLoading };
};

export default useLoading;
