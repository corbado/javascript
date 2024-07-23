import { useState } from 'react';

const LOADING_ANIMATION_TIMEOUT = 100;

const useLoading = (initialState?: boolean) => {
  const [loading, setLoading] = useState(initialState ?? true);

  const finishLoading = () => setTimeout(() => setLoading(false), LOADING_ANIMATION_TIMEOUT);

  const startLoading = () => setLoading(true);

  return { loading, finishLoading, startLoading };
};

export default useLoading;
