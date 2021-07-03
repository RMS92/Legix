import React, { useEffect } from "react";
import { Redirect, useParams } from "react-router-dom";
import useQuery from "../hooks/useQuery";
import { apiFetch } from "../utils/api";

export default function EmailConfirm({
  setFlashMessages,
}: {
  setFlashMessages: Function;
}) {
  // @ts-ignore
  const { id } = useParams();
  const query = useQuery();

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch("/register/confirm", {
          method: "post",
          body: JSON.stringify({ id, token: query.get("token") }),
          dataType: "json",
        });
        setFlashMessages(res);
      } catch (err) {
        setFlashMessages(err);
        console.log(err);
      }
    })();
  }, []);

  return <Redirect to="/connexion" />;
}
