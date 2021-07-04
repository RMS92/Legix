import React, { SyntheticEvent, useEffect, useState } from "react";
import clsx from "clsx";
import Field from "../../ui/Field";
import { apiFetch, formToObject } from "../../utils/api";
import { FlashMessage } from "../../types";
import Alert from "../../ui/Alert";
import { Redirect } from "react-router-dom";

export default function ForgotPasswordForm({
  flashMessages,
  setFlashMessages,
}: {
  flashMessages: FlashMessage;
  setFlashMessages: Function;
}) {
  const [animation, setAnimation] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    setAnimation("in");
    setFlashMessages("");
  }, []);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setFlashMessages("");

    const form: HTMLFormElement = e.target as HTMLFormElement;
    const data: string = JSON.stringify(formToObject(form));

    try {
      const res = await apiFetch("/password/reset", {
        method: "post",
        body: data,
        dataType: "json",
      });
      setRedirect(true);
      setFlashMessages(res);
    } catch (err) {
      setFlashMessages(err);
      console.log(err);
    }
  };

  return redirect ? (
    <Redirect to="/connexion" />
  ) : (
    <div className="auth-container">
      <h1 className={clsx("auth-title my5 fade", animation)}>
        Mot de passe oublié
      </h1>
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
        <button className="btn-gradient" type="submit">
          Suivre les instructions
        </button>
      </form>
    </div>
  );
}
