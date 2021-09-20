import React, { useEffect, useState } from "react";
import { useToggle } from "../hooks/useToogle";
import clsx from "clsx";

export default function Checkbox({
  object,
  state,
  fields = {},
  onUpdate,
  onClick,
  type,
}: {
  object: any;
  state: boolean;
  fields?: {};
  onUpdate: Function;
  onClick: Function;
  type: string;
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
        console.log(checked);
        Object.assign(fields, { is_visible: checked });
        await onUpdate(object, type, fields);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [checked]);

  const handleChange = async () => {
    setChecked();
  };
  return (
    <div className="form-switch" onClick={() => onClick()}>
      <input type="checkbox" checked={checked} onChange={handleChange} />
      <label onClick={handleChange}>
        <span className={clsx("switch")} />
      </label>
    </div>
  );
}
