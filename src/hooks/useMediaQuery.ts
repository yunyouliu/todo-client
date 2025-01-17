import { useState, useEffect } from 'react';

const useMediaQuery = (query: string): boolean => {
  const mediaQuery = window.matchMedia(query);
  const [matches, setMatches] = useState<boolean>(mediaQuery.matches);

  useEffect(() => {
    const listener = () => setMatches(mediaQuery.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

export default useMediaQuery;
