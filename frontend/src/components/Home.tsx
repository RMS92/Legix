import React, { useState } from "react";
import Icon from "../ui/Icon";
import { Link } from "react-router-dom";
import { FlashMessage, User } from "../types";
import Alert from "../ui/Alert";
import clsx from "clsx";

export default function Home({ user }: { user: User }) {
  const [flashMessages, setFlashMessages] = useState<FlashMessage | null>(null);
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
              {user ? (
                <Link to="/scans/nouveau" className="btn-primary-outlined">
                  Scanner ma paire
                </Link>
              ) : (
                <button
                  className="btn-primary-outlined"
                  onClick={() => {
                    setFlashMessages({
                      message:
                        "Veuillez créer ou vous connecter à votre compte afin de pouvoir publier votre scan.",
                      success: false,
                      status: 400,
                    });
                  }}
                >
                  Scanner ma paire
                </button>
              )}
            </div>
          </div>
          <div className="home-intro__illustration">
            <Icon
              name="home-illustration"
              className="illustration illustration-home text-success"
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
