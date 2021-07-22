import React, { useEffect, useState } from "react";
import Icon from "../ui/Icon";
import clsx from "clsx";
import Field from "../ui/Field";
import { Scan, User } from "../types";
import { ScanCard } from "../ui/Cards";
import { apiFetch } from "../utils/api";

export default function Profil({ user }: { user: User }) {
  const [page, setPage] = useState("profil");

  return (
    <>
      <header className="page-header separated">
        <div className="profil-header">
          <div className="profil-header__avatar">
            <Icon name="roundedUser" width="101" height="101" />
          </div>
          <div className="profil-header__body">
            <h1 className="h1">Mon compte</h1>
            <p>
              <a href="#" className="badge badge-primary">
                Compte standard
              </a>
              <span className="label-large text-normal">
                Inscrit depuis environ 1 an
              </span>
            </p>
          </div>
        </div>
      </header>
      <div className="profil-nav">
        <a
          href="#"
          className={clsx(
            "h5 normal icon-verticalAlign",
            page === "profil" ? "is-selected" : null
          )}
          onClick={() => setPage("profil")}
        >
          <Icon name="profil" className="icon icon-profil" />
          Profil
        </a>
        <a
          href="#edition"
          className={clsx(
            "h5 normal icon-verticalAlign",
            page === "edit" ? "is-selected" : null
          )}
          onClick={() => setPage("edit")}
        >
          <Icon name="user" className="icon icon-user" />
          Editer
        </a>
        <a
          href="#scans"
          className={clsx(
            "h5 normal icon-verticalAlign",
            page === "scans" ? "is-selected" : null
          )}
          onClick={() => setPage("scans")}
        >
          <Icon name="badge" className="icon icon-badge" />
          Scans
        </a>
      </div>
      <ProfilBody user={user} page={page} />
    </>
  );
}

function ProfilBody({ user, page }: { user: User; page: string }) {
  return page === "edit" ? (
    <ProfilBodyEdit user={user} />
  ) : page === "scans" ? (
    <ProfilBodyScans user={user} />
  ) : null;
}

function ProfilBodyEdit({ user }: { user: User }) {
  return (
    <div className="layout-sidebar py5">
      <main className="stack-large">
        <form className="stack-large" method="post">
          <div className="stack">
            <h4 className="stack-large__title">
              <Icon name="user" />
              Mes informations
            </h4>
            <div className="level1 grid p3">
              <Field name="email" type="email" placeholder={user.email}>
                Adresse email
              </Field>

              <Field name="username" placeholder={user.username}>
                Nom d'utilisateur
              </Field>

              <Field name="age">Age</Field>
            </div>
            <div className="text-right">
              <button className="btn-primary" type="submit">
                Mofidier mon profil
              </button>
            </div>
          </div>
        </form>

        <form className="stack">
          <h4 className="stack-large__title">
            <Icon name="mdp" />
            Mot de passe
          </h4>
          <div className="level1 grid2 p3">
            <Field
              name="password"
              type="password"
              placeholder="Nouveau mot de passe"
            />
            <Field
              name="password2"
              type="password"
              placeholder="Confirmer le mot de passe"
            />
          </div>
          <div className="text-right">
            <button className="btn-primary" type="submit">
              Mofidier mon mot de passe
            </button>
          </div>
        </form>

        <div className="stack">
          <h4 className="stack-large__title text-danger">
            <Icon name="delete" />
            Danger zone
          </h4>
          <p className="h5 normal">
            Vous n'êtes pas satisfait du contenu de notre application ?
            <br />
            Vous souhaitez supprimer toutes les informations associées à votre
            compte?
          </p>
          <div className="text-right">
            <button className="btn-danger" type="button">
              <Icon
                name="delete"
                width="16"
                height="16"
                className="icon icon-delete"
              />
              Supprimer mon compte
            </button>
          </div>
        </div>
      </main>
      <aside></aside>
    </div>
  );
}

function ProfilBodyScans({ user }: { user: User }) {
  const [scans, setScans] = useState<Scan[]>([]);
  useEffect(() => {
    (async () => {
      const res = await apiFetch("/scans/users/" + user._id);
      setScans(res);
    })();
  }, []);

  if (!scans) {
    return <></>;
  }

  return (
    <div className="layout-sidebar py5">
      <main className="stack-large">
        <h4 className="stack-large__title">
          <Icon name="badge" />
          Mes Scans
        </h4>
        <div className="scans">
          {scans.map((s) => (
            <ScanCard key={s._id} scan={s} />
          ))}
        </div>
      </main>
    </div>
  );
}
