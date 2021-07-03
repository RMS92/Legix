import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import useQuery from "../hooks/useQuery";
import { apiFetch } from "../utils/api";

export default function EmailConfirm() {
  // @ts-ignore
  const { id } = useParams();
  const query = useQuery();

  useEffect(() => {
    (async () => {
      await apiFetch("/register/confirm", {
        method: "post",
        body: JSON.stringify({ id, token: query.get("token") }),
        dataType: "json",
      });
    })();
  }, []);

  return <Redirect to="/connexion" />;
}
