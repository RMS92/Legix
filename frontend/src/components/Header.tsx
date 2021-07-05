import React, { Dispatch, SetStateAction, useState } from "react";
import Icon from "../ui/Icon";
import { Link } from "react-router-dom";
import { apiFetch } from "../utils/api";
import { User } from "../types";

export default function Header({
  user,
  connect,
  onConnect,
}: {
  user: User | object;
  connect: boolean;
  onConnect: Dispatch<SetStateAction<boolean>>;
}) {
  const [page, setPage] = useState("home");

  const handleLogout = async () => {
    try {
      const res = await apiFetch("/logout");
      onConnect(res);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <nav className="header">
      <ul className="header-nav">
        <li className="header__home">
          <Link
            to="/"
            className={page === "home" ? "is-active" : ""}
            onClick={() => setPage("home")}
          >
            <Icon name="home" />
          </Link>
          <Icon name="separator" />
        </li>

        <li>
          <Link
            to="/scans"
            className={page === "scans" ? "is-active" : ""}
            onClick={() => setPage("scans")}
          >
            Scans
          </Link>
        </li>
      </ul>

      <ul className="header-side">
        {connect ? (
          <>
            {"roles" in user &&
            (user.roles.includes("ROLE_ADMIN") ||
              user.roles.includes("ROLE_SUPERADMIN")) ? (
              <li className="header__dashboard">
                <Link
                  to="/administration"
                  className={page === "admin" ? "is-active" : ""}
                  onClick={() => setPage("admin")}
                >
                  Administration
                </Link>
              </li>
            ) : null}

            <li className="header__account">
              <Link
                to="/profil"
                className={page === "account" ? "is-active" : ""}
                onClick={() => setPage("account")}
              >
                <Icon name="separator" />
                <Icon name="user" />
                {"username" in user ? user.username : null}
              </Link>
            </li>

            <li className="header__logout">
              <Link to="/" onClick={handleLogout}>
                <Icon name="logout" />
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className="header-side__auth">
              <Link
                to="/inscription"
                className="btn-primary-outlined"
                onClick={() => setPage("register")}
              >
                S'inscrire
              </Link>
              <Link
                to="/connexion"
                className="btn-primary"
                onClick={() => setPage("login")}
              >
                Me connecter
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
