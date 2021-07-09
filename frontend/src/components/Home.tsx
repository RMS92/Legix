import React from "react";
import Icon from "../ui/Icon";
import { Link } from "react-router-dom";
import { FlashMessage } from "../types";
import Alert from "../ui/Alert";
import clsx from "clsx";

export default function Home({
  flashMessages,
  setFlashMessages,
}: {
  flashMessages: FlashMessage;
  setFlashMessages: Function;
}) {
  return (
    <>
      {flashMessages ? (
        <Alert
          isFloating={true}
          type={clsx(flashMessages.success ? "success" : "danger")}
          onDisappear={setFlashMessages}
        >
          {flashMessages.message}
        </Alert>
      ) : null}
      <main className="homepage">
        <section className="home-intro container">
          <div className="home-intro__body stack">
            <div className="hero-title">
              <strong>Authentifie </strong>
              tes paires de sneakers.
            </div>
            <div className="hero-text">
              Legix et ses experts <strong>lèvent les doutes</strong> sur
              l'authenticité de tes sneakers.
            </div>
            <div className="hstack">
              <Link to="/inscription" className="btn-primary">
                Créer mon compte
              </Link>
              <Link to="/scans/nouveau" className="btn-primary-outlined">
                Scanner ma paire
              </Link>
            </div>
          </div>
          <div className="home-intro__illustration">
            <Icon
              name="home-illustration"
              className="illustration illustration-home"
            />
          </div>
        </section>
        <section className="home-info container">
          <div className="home-info__mosaic"></div>
          <div className="home-info__body stack">
            <div className="hero-title">
              <strong>L'application </strong>
              sneakers anti-fake.
            </div>
            <div className="hero-text">
              Un doute sur l’authenticité d’une paire de sneakers que tu portes
              au quotidien ou que tu t’apprêtes à acheter ? Fais valider son
              authenticité par nos experts.
            </div>
          </div>
        </section>
        <section className="home-scans container">
          <div className="home-scans__hero stack">
            <div className="hero-title">
              <strong>Les scans </strong>
              d'authentification
            </div>
            <div className="hero-text">
              Un scan regroupe l’ensemble des photos et documents concernant ta
              paire qui nous serviront à effectuer son authentification.
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
