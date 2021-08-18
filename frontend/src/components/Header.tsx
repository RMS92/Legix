import React, { Dispatch, SetStateAction } from "react";
import Icon from "../ui/Icon";
import { Link, NavLink } from "react-router-dom";
import { apiFetch } from "../utils/api";
import { User } from "../types";
import Notifications from "../ui/Notifications";

export default function Header({
  user,
  connect,
  onConnect,
}: {
  user: User | null;
  connect: boolean;
  onConnect: Dispatch<SetStateAction<boolean>>;
}) {
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
          <NavLink exact to="/">
            <Icon name="home" />
          </NavLink>
          <Icon name="separator" />
        </li>

        <li>
          <NavLink exact to="/scans">
            Scans
          </NavLink>
        </li>
      </ul>

      <ul className="header-side">
        {connect ? (
          <>
            <li className="header__notification">
              <Notifications user={user} onConnect={onConnect} />
            </li>

            {user?.roles &&
            (user.roles.includes("ROLE_ADMIN") ||
              user.roles.includes("ROLE_SUPERADMIN")) ? (
              <li className="header__dashboard">
                <NavLink to="/administration">Administration</NavLink>
              </li>
            ) : null}

            <li className="header__account">
              <NavLink exact to="/profil">
                <Icon name="user" />
                {user?.username ? user.username : null}
              </NavLink>
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
              <NavLink exact to="/inscription" className="btn-primary-outlined">
                S'inscrire
              </NavLink>
              <NavLink exact to="/connexion" className="btn-primary">
                Me connecter
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
