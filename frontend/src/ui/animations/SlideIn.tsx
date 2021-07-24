import React, { useEffect, useState } from "react";

type SlideProps = {
  show: boolean;
  className?: string;
  children: any;
};

export default function SlideIn({
  show,
  className = "",
  children,
}: SlideProps) {
  const [shouldRender, setRender] = useState(show);

  useEffect(() => {
    if (show) setRender(true);
  }, [show]);

  const onAnimationEnd = (e: any) => {
    if (!show && e.animationName === "slideOut") setRender(false);
  };

  return shouldRender ? (
    <div
      className={className}
      style={{
        animation: `${show ? "slideIn" : "slideOut"} .3s both`,
      }}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </div>
  ) : (
    <div />
  );
}
