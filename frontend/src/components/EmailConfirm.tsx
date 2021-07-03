import React from "react";
import { useParams } from "react-router-dom";

export default function EmailConfirm() {
  // @ts-ignore
  const { token } = useParams();
  console.log("token", token);
  return <div>Confirm email</div>;
}
