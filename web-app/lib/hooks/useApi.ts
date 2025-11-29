// Custom React hook for API calls with loading and error states

import { useState, useCallback } from 'react';
import { ApiError } from '../api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T = any>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (apiFunction: () => Promise<T>): Promise<T | null> => {
      setState({ data: null, loading: true, error: null });
      
      try {
        const result = await apiFunction();
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (err) {
        const errorMessage = err instanceof ApiError 
          ? err.message 
          : 'An unexpected error occurred';
        
        setState({ data: null, loading: false, error: errorMessage });
        console.error('API Error:', err);
        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

export default useApi;
