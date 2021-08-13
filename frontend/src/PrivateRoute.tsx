import React, { ReactNode } from "react";
import { User } from "./types";
import { Redirect, Route } from "react-router-dom";

type PrivateRoute = {
  user: User;
  path: string;
  requiredConnection?: boolean;
  requiredRoles?: Array<string>;
  children: ReactNode;
};

export default function PrivateRoute({
  user,
  path,
  requiredConnection = true,
  requiredRoles = ["ROLE_USER"],
  children,
}: PrivateRoute) {
  return user &&
    (requiredConnection || requiredRoles?.includes(user.roles[0])) ? (
    <Route exact path={path}>
      {children}
    </Route>
  ) : (
    <Redirect to="/" />
  );
}
