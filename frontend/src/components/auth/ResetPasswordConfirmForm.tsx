import React, { SyntheticEvent, useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import clsx from "clsx";
import Alert from "../../ui/Alert";
import Field from "../../ui/Field";
import { FlashMessage } from "../../types";
import { apiFetch, formToObject } from "../../utils/api";
import useQuery from "../../hooks/useQuery";

export default function ResetPasswordConfirmForm({
  flashMessages,
  setFlashMessages,
}: {
  flashMessages: FlashMessage;
  setFlashMessages: Function;
}) {
  const [animation, setAnimation] = useState("");
  const [redirect, setRedirect] = useState(false);

  // @ts-ignore
  const { id } = useParams();
  const query = useQuery();

  useEffect(() => {
    setAnimation("in");
    setFlashMessages("");
  }, []);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setFlashMessages("");

    const form: HTMLFormElement = e.target as HTMLFormElement;
    const data: object = formToObject(form);
    Object.assign(data, { id, token: query.get("token") });

    try {
      const res = await apiFetch("/password/reset/confirm", {
        method: "post",
        body: JSON.stringify(data),
        dataType: "json",
      });
      setRedirect(true);
      setFlashMessages(res);
    } catch (err) {
      setFlashMessages(err);
      console.log(e);
    }
  };

  return redirect ? (
    <Redirect to="/connexion" />
  ) : (
    <div className="auth-container">
      <h1 className={clsx("auth-title my5 fade", animation)}>
        Redéfinir mon mot de passe
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
        <Field name="password" type="password" placeholder="">
          Nouveau mot de passe
        </Field>
        <Field name="password2" type="password" placeholder="">
          Confirmer le nouveau mot de passe
        </Field>
        <button className="btn-gradient" type="submit">
          Réinitialiser mon mot de passe
        </button>
      </form>
    </div>
  );
}
