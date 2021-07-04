import React, { SyntheticEvent, useEffect, useState } from "react";
import clsx from "clsx";
import Field from "../../ui/Field";

export default function ForgotPasswordForm() {
  const [animation, setAnimation] = useState("");

  useEffect(() => {
    setAnimation("in");
  }, []);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    try {
    } catch (err) {
      console.log(e);
    }
  };

  return (
    <div className="auth-container">
      <h1 className={clsx("auth-title my5 fade", animation)}>
        Mot de passe oublié
      </h1>
      <form
        className={clsx("auth-form fade fade-1", animation)}
        method="post"
        onSubmit={handleSubmit}
      >
        <Field name="email" type="email" placeholder="">
          Adresse email
        </Field>
        <button className="btn-gradient" type="submit">
          Suivre les instructions
        </button>
      </form>
    </div>
  );
}
