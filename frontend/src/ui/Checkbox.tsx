import React, { useEffect, useState } from "react";
import { useToggle } from "../hooks/useToogle";
import clsx from "clsx";

export default function Checkbox({
  object,
  state,
  onUpdate,
}: {
  object: any;
  state: boolean;
  onUpdate: Function;
}) {
  const [checked, setChecked] = useToggle(state);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        await onUpdate(object, { is_visible: checked });
      } catch (err) {
        console.log(err);
      }
    })();
  }, [checked]);

  const handleChange = async () => {
    setChecked();
  };
  return (
    <div className="form-switch">
      <input type="checkbox" checked={checked} onChange={handleChange} />
      <label onClick={handleChange}>
        <span className={clsx("switch")} />
      </label>
    </div>
  );
}
