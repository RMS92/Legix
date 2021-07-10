import { RefObject, useEffect } from "react";

export function useClickOutside(
  ref: RefObject<HTMLDivElement>,
  cb: () => void
) {
  useEffect(() => {
    if (cb === null) {
      return;
    }
    const escCb = (e: KeyboardEvent) => {
      if (e.key === "Escape" && ref.current) {
        cb();
      }
    };
    const clickCb = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        cb();
      }
    };
    document.addEventListener("click", clickCb);
    document.addEventListener("keyup", escCb);
    return function cleanup() {
      document.removeEventListener("click", clickCb);
      document.removeEventListener("keyup", escCb);
    };
  }, [ref, cb]);
}
