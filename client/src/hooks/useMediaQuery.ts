import { useEffect, useState } from 'react';

const presets: { [key: string]: string } = {
  sm: '(max-width: 599px)',
  md: '(max-width: 959px)',
  lg: '(max-width: 1279px)'
};

const useMediaQuery = (query: string) => {
  const [isMatch, setIsMatch] = useState(window.matchMedia(presets[query] || query).matches);

  useEffect(() => {
    const handleResize = () => setIsMatch(window.matchMedia(presets[query] || query).matches);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [query]);

  return isMatch;
};

export default useMediaQuery;