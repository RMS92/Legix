/**
 * useEffect pour une fonction asynchrone
 */
import { useEffect } from "react";

export function useAsyncEffect(fn: Function, deps: any = []) {
  /* eslint-disable */
  useEffect(() => {
    fn();
  }, deps);
  /* eslint-enable */
}
