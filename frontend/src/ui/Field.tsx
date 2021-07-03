import React, { useMemo } from "react";
import { Props } from "../types";

export default function Field({
  name,
  type = "text",
  placeholder = "",
  children,
  required = true,
}: {
  name: string;
  type?: string;
  placeholder?: string;
  children?: any;
  required?: boolean;
}) {
  const attr = {
    name,
    id: name,
    type,
    placeholder,
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
