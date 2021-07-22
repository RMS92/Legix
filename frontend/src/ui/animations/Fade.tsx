import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useUpdateEffect } from "../../hooks/useUpdateEffect";

const VISIBLE = 1;
const HIDDEN = 2;
const ENTERING = 3;
const LEAVING = 4;

export default function Fade({
  type = "",
  visible,
  zIndex = 0,
  children,
  duration = 300,
  animateEnter = false,
  from = { opacity: 0 },
}: {
  type?: string;
  visible: boolean;
  zIndex?: number;
  children: ReactNode;
  duration: number;
  animateEnter?: boolean;
  from: { opacity: number };
}) {
  const childRef = useRef(children);
  const [state, setState] = useState(
    visible ? (animateEnter ? ENTERING : VISIBLE) : HIDDEN
  );

  if (visible) {
    childRef.current = children;
  }

  useUpdateEffect(() => {
    if (!visible) {
      setState(LEAVING);
    } else {
      setState((s) => (s === HIDDEN ? ENTERING : VISIBLE));
    }
  }, [visible]);

  // @ts-ignore
  useEffect(() => {
    if (state === LEAVING) {
      const timer = setTimeout(() => {
        setState(HIDDEN);
      }, duration);
      return () => {
        clearTimeout(timer);
      };
    } else if (state === ENTERING) {
      /* eslint-disable @typescript-eslint/no-unused-expressions */
      document.body.offsetHeight;
      /* eslint-enable */
      setState(VISIBLE);
    }
  }, [state]);

  if (state === HIDDEN) {
    return null;
  }

  const style = {
    transitionDuration: `${duration}ms`,
    transitionProperty: "opacity transform",
    position: "relative",
    zIndex: `${zIndex}`,
  };
  if (state !== VISIBLE) {
    if (from.opacity !== undefined) {
      // @ts-ignore
      style.opacity = from.opacity;
    }
    if (type === "translate3D") {
      // @ts-ignore
      style.transform = `translate3d(${from.x ?? 0}px, ${from.y ?? 0}px, ${
        // @ts-ignore
        from.z ?? 0
      }px)`;
    }
  }

  return (
    <div // @ts-ignore
      style={style}
    >
      {childRef.current}
    </div>
  );
}
