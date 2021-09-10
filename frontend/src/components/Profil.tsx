import React, {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import Icon from "../ui/Icon";
import clsx from "clsx";
import Field from "../ui/Field";
import { AvatarFile, FlashMessage, Scan, User } from "../types";
import { ScanCard } from "../ui/Cards";
import { apiFetch } from "../utils/api";
import Alert from "../ui/Alert";
import ModalDeleteAccount from "./modals/ModalDeleteAccount";
import { API_URL } from "../config";
import { dateDiff } from "../utils/functions";

export default function Profil({ user }: { user: User }) {
  const [page, setPage] = useState("profil");
  const [modal, setModal] = useState("");
  // @ts-ignore
  const [flashMessages, setFlashMessages] = useState<FlashMessage>(null);
  const [profilPicture, setProfilPicture] = useState<AvatarFile | null>(null);

  const nbOfDays: string = dateDiff(new Date(user?.created_at), true);

  useEffect(() => {
    (async () => {
      if (!user?.avatarFile) {
        return;
      }
      const res = await apiFetch("/files/" + user.avatarFile + "/avatarFile");
      setProfilPicture(res);
    })();
  }, [user?.avatarFile]);

  const handleChange = async (e: SyntheticEvent) => {
    // @ts-ignore
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);
    try {
      // Update user with avatar file
      const { avatarFile } = await fetch(
        API_URL + "/users/" + user._id + "/avatarFile",
        {
          credentials: "include",
          method: "PATCH",
          body: data,
        }
      ).then((res) => {
        return res.json().then((data) => {
          return data;
        });
      });

      // Find and set new avatar file from user
      const file = await apiFetch("/files/" + avatarFile + "/avatarFile");
      setProfilPicture(file);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {flashMessages ? (
        <Alert
          type={clsx(flashMessages.success ? "success" : "danger")}
          isFloating={true}
          onDisappear={setFlashMessages}
        >
          {flashMessages.message}
        </Alert>
      ) : null}
      {modal === "delete-account-modal" ? (
        <ModalDeleteAccount
          user={user}
          setModal={setModal}
          setFlashMessages={setFlashMessages}
        />
      ) : null}
      <header className="page-header separated">
        <div className="profil-header">
          <div className="profil-header__avatar">
            {profilPicture ? (
              <img
                src={
                  process.env.PUBLIC_URL +
                  `/media/uploads/profil/${user.username}/${profilPicture.current_filename}`
                }
                alt={`avatar-${user.username}`}
              />
            ) : (
              <img src="/media/default.png" alt="avatar-default" />
            )}
            <div className="profil-header__upload">
              <Icon name="cloud" width="20" />
            </div>
            <input type="file" name="avatarFile" onChange={handleChange} />
          </div>
          <div className="profil-header__body">
            <h1 className="h1">Mon compte</h1>
            <p>
              <a href="#" className="badge badge-primary">
                Compte standard
              </a>
              <span className="label-large text-normal">
                Inscrit depuis environ {nbOfDays}
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
      <ProfilBody
        user={user}
        page={page}
        setFlashMessages={setFlashMessages}
        setModal={setModal}
      />
    </>
  );
}

function ProfilBody({
  user,
  page,
  setFlashMessages,
  setModal,
}: {
  user: User;
  page: string;
  setFlashMessages: Dispatch<SetStateAction<FlashMessage>>;
  setModal: Dispatch<SetStateAction<string>>;
}) {
  return page === "edit" ? (
    <ProfilBodyEdit
      user={user}
      setFlashMessages={setFlashMessages}
      setModal={setModal}
    />
  ) : page === "scans" ? (
    <ProfilBodyScans user={user} />
  ) : null;
}

function ProfilBodyEdit({
  user,
  setFlashMessages,
  setModal,
}: {
  user: User;
  setFlashMessages: Dispatch<SetStateAction<FlashMessage>>;
  setModal: Dispatch<SetStateAction<string>>;
}) {
  const [passwordFields, setPasswordFields] = useState({
    password: "",
    password2: "",
  });

  const handlePasswordSubmit = async () => {
    try {
      const res = await apiFetch("/users/" + user._id + "/password", {
        method: "PATCH",
        body: JSON.stringify(passwordFields),
      });
      setFlashMessages(res);
      setPasswordFields({
        password: "",
        password2: "",
      });
    } catch (err) {
      setFlashMessages(err);
    }
  };

  const handlePasswordChange = (e: SyntheticEvent) => {
    // @ts-ignore
    const value = e.target.value;
    // @ts-ignore
    setPasswordFields({ ...passwordFields, [e.target.name]: value });
  };

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
              <Field
                name="email"
                type="email"
                value={user.email}
                readOnly={true}
              >
                Adresse email
              </Field>

              <Field
                name="username"
                type="text"
                value={user.username}
                readOnly={true}
              >
                Nom d'utilisateur
              </Field>

              <Field name="age">Age</Field>
            </div>
            <div className="text-right">
              <button className="btn-primary" type="button">
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
              value={passwordFields.password}
              onChange={handlePasswordChange}
            />
            <Field
              name="password2"
              type="password"
              placeholder="Confirmer le mot de passe"
              value={passwordFields.password2}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="text-right">
            <button
              className="btn-primary"
              type="button"
              onClick={handlePasswordSubmit}
            >
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
            <button
              className="btn-danger"
              type="button"
              onClick={() => setModal("delete-account-modal")}
            >
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
