import React, { useEffect, useState } from "react";
import Field from "../../ui/Field";
import { apiFetch, formToObject } from "../../utils/api";
import Alert from "../../ui/Alert";
import clsx from "clsx";

export default function RegisterForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [animation, setAnimation] = useState("");

  useEffect(() => {
    setAnimation("in");
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");

    const form: HTMLFormElement = e.target as HTMLFormElement;
    const data: string = JSON.stringify(formToObject(form));

    try {
      const res = await apiFetch("/register", {
        method: "post",
        body: data,
        dataType: "json",
      });
      setSuccess(res.message);
      form.reset();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="auth-container">
      <h1 className={clsx("auth-title my5 fade", animation)}>S'inscrire</h1>
      {error ? (
        <Alert type="danger" onDisappear={setError}>
          {error}
        </Alert>
      ) : null}
      {success ? (
        <Alert type="success" onDisappear={setSuccess}>
          {success}
        </Alert>
      ) : null}
      <form
        className={clsx("auth-form fade fade-1", animation)}
        method="post"
        onSubmit={handleSubmit}
      >
        <Field name="username">Nom d'utilisateur</Field>
        <Field name="email" type="email">
          Adresse email
        </Field>
        <Field name="full_name" type="text">
          Nom et prénom
        </Field>
        <Field name="password" type="password">
          Mot de passe
        </Field>
        <Field name="password2" type="password">
          Confirmer le mot de passe
        </Field>
        <button className="btn-gradient" type="submit">
          S'inscrire
        </button>
      </form>
    </div>
  );
}
