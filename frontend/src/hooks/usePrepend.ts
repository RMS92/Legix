import { useCallback, useState } from "react";

export function usePrepend(initialValue: any = []) {
  const [value, setValue] = useState(initialValue);
  return [
    value,
    useCallback((item: any) => {
      setValue((v: any) => [item, ...v]);
    }, []),
  ];
}

export function useReversePrepend(initialValue: any = []) {
  const [value, setValue] = useState(initialValue);
  return [
    value,
    useCallback((item: any) => {
      setValue((v: any) => [...v, item]);
    }, []),
  ];
}
