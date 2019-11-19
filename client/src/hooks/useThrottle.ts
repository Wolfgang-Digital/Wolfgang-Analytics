import { useRef } from 'react';
import { throttle } from 'lodash';

interface Props {
  fn: (...args: any) => any
  delay?: number
}

const useThrottle = ({ fn, delay = 100 }: Props) => {
  const ref = useRef(throttle(fn, delay, { trailing: false }));
  return ref.current;
};

export default useThrottle;