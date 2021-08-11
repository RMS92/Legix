import React, { SyntheticEvent, useMemo } from "react";
import { Props } from "../types";

export default function Field({
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  children,
  readOnly = false,
  required = true,
}: {
  name: string;
  type?: string;
  onChange?: (e: SyntheticEvent) => void;
  value?: string;
  placeholder?: string;
  children?: any;
  readOnly?: boolean;
  required?: boolean;
}) {
  const attr = {
    name,
    id: name,
    onChange,
    value,
    type,
    placeholder,
    readOnly,
    required,
  };

  return (
    <div className="form-group">
      {children && <label htmlFor={name}>{children}</label>}
      {type === "textarea" ? (
        <FieldTextarea {...attr} />
      ) : (
        <FieldInput {...attr} />
      )}
    </div>
  );
}

function FieldInput(props: Props) {
  return <input {...props} />;
}

function FieldTextarea(props: Props) {
  return <textarea {...props} />;
}
