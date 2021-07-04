import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Field from "../../ui/Field";
import { apiFetch, formToObject } from "../../utils/api";
import Alert from "../../ui/Alert";
import clsx from "clsx";
import { FlashMessage } from "../../types";
import { Link } from "react-router-dom";

export default function LoginForm({
  onConnect,
  flashMessages,
  setFlashMessages,
}: {
  onConnect: Dispatch<SetStateAction<boolean>>;
  flashMessages: FlashMessage;
  setFlashMessages: Function;
}) {
  const [error, setError] = useState("");
  const [animation, setAnimation] = useState("");

  useEffect(() => {
    setAnimation("in");
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    setFlashMessages("");

    const form: HTMLFormElement = e.target as HTMLFormElement;
    const data: string = JSON.stringify(formToObject(form));

    try {
      await apiFetch("/login", {
        method: "post",
        body: data,
        dataType: "json",
      });

      onConnect(true);
      form.reset();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="auth-container">
      <h1 className={clsx("auth-title my5 fade", animation)}>Me connecter</h1>
      {error ? (
        <Alert type="danger" onDisappear={setError}>
          {error}
        </Alert>
      ) : null}
      {flashMessages ? (
        <Alert
          type={clsx(flashMessages.success ? "success" : "danger")}
          onDisappear={setFlashMessages}
        >
          {flashMessages.message}
        </Alert>
      ) : null}
      <form
        className={clsx("auth-form fade fade-1", animation)}
        method="post"
        onSubmit={handleSubmit}
      >
        <Field name="email" type="email" placeholder="">
          Adresse email
        </Field>
        <Field name="password" type="password">
          Mot de passe
        </Field>
        <div className="auth-actions flex flex-end">
          <Link to="/password/nouveau" className="auth-password-forgot">
            Mot de passe oublié ?
          </Link>
        </div>
        <button className="btn-gradient" type="submit">
          Se connecter
        </button>
      </form>
    </div>
  );
}
