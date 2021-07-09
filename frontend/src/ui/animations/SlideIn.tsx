import React, { useEffect, useState } from "react";

type SlideProps = {
  show: boolean;
  fadeDelay: string;
  children: any;
};

export default function SlideIn({
  show,
  fadeDelay = "",
  children,
}: SlideProps) {
  const [shouldRender, setRender] = useState(show);

  useEffect(() => {
    if (show) setRender(true);
  }, [show]);

  return shouldRender ? (
    <div className={show ? `fade ${fadeDelay} in` : ""}>{children}</div>
  ) : (
    <div />
  );
}
