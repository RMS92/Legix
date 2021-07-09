import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Icon from "./Icon";

export default function Alert({
  type,
  isFloating = false,
  onDisappear,
  children,
}: {
  type: string;
  isFloating?: boolean;
  onDisappear: Function;
  children: any;
}) {
  const [close, setClose] = useState(false);
  const [timer, setTimer] = useState(false);
  let className: string = `alert ${
    isFloating ? "is-floating" : ""
  }  alert-${type} ${timer ? "alert-out" : ""}`;

  if (close) {
    className += "  alert-out";
    // Reset message state
    const timer = setTimeout(() => {
      onDisappear("");
    }, 300);

    // return () => clearTimeout(timer);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimer(true);
      const timerThen = setTimeout(() => {
        onDisappear("");
      }, 300);
      return () => clearTimeout(timerThen);
    }, 7000);

    return () => clearTimeout(timer);
  }, [timer]);

  return (
    <div className={className}>
      {type === "danger" ? (
        <Icon name="warning" size="12" />
      ) : type === "success" ? (
        <Icon name="success" size="12" />
      ) : null}
      <div>{children}</div>
      <button className="alert-close" onClick={() => setClose(true)}>
        <Icon name="cross" size="12" />
      </button>
    </div>
  );
}
