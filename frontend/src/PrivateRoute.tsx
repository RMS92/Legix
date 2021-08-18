import React, { ReactNode, useEffect, useState } from "react";
import { User } from "./types";
import { Redirect, Route } from "react-router-dom";
import { apiFetch } from "./utils/api";

type PrivateRouteType = {
  path: string;
  requiredConnection?: boolean;
  requiredRoles?: Array<string>;
  children: ReactNode;
};

export default function PrivateRoute({
  path,
  requiredConnection = true,
  requiredRoles = ["ROLE_USER"],
  children,
}: PrivateRouteType) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const user = await apiFetch("/me");
        if (!user) {
          setUser(null);
          return;
        }
        setUser(user);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  if (!user) {
    return <></>;
  }

  return requiredConnection && requiredRoles?.includes(user?.roles[0]) ? (
    <Route exact path={path}>
      {children}
    </Route>
  ) : (
    <Redirect to="/" />
  );
}
