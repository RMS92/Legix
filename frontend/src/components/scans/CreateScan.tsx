import React, { useEffect, useRef, useState } from "react";
import Icon from "../../ui/Icon";
import clsx from "clsx";
import { DownloadCard } from "../../ui/Cards";
import Field from "../../ui/Field";
import { useFiles } from "../../hooks/useFiles";
import { API_URL } from "../../config";
import { Redirect } from "react-router-dom";

export default function CreateScan({
  setFlashMessages,
}: {
  setFlashMessages: Function;
}) {
  const [page, setPage] = useState("scan");

  return (
    <>
      <header className="page-header separated">
        <div className="profil-header">
          <div className="profil-header__avatar">
            <Icon name="home-illustration" width="100" />
          </div>
          <div className="profil-header__body">
            <h1 className="h1">
              <strong className="strong-title">Créer</strong> ton scan.
            </h1>
            <h5 className="h5">
              Roromain
              <a className="badge badge-primary">Mode création</a>
            </h5>
            <h6>
              Télécharge toutes les photos nécessaires à l’authentification de
              ta paire.
            </h6>
          </div>
        </div>
      </header>
      <div className="profil-nav">
        <a
          href="#"
          className={clsx(
            "h5 normal icon-verticalAlign",
            page === "scan" ? "is-selected" : null
          )}
          onClick={() => setPage("scan")}
        >
          <Icon name="add" className="icon icon-badge" />
          Création
        </a>
      </div>
      <CreateScanBody setFlashMessages={setFlashMessages} />
    </>
  );
}

function CreateScanBody({ setFlashMessages }: { setFlashMessages: Function }) {
  const { files, fetchFiles, addFile, changeFile, deleteFile, resetFiles } =
    useFiles();
  const buttonRef = useRef<HTMLButtonElement>();
  const [reset, setReset] = useState(false);

  useEffect(() => {
    (async () => {
      // Init files hook data with empty array
      await fetchFiles([]);
    })();
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setFlashMessages("");

    const form: HTMLFormElement = e.target as HTMLFormElement;
    const data = new FormData(form);
    files.forEach((f: any) => data.append("files", f));

    try {
      await fetch(API_URL + "/scans", {
        credentials: "include",
        method: "post",
        body: data,
      });
      setFlashMessages({
        message:
          "Votre demande d'authentification a bien été créée. Un email récapitulatif vous a été envoyé.",
        success: true,
      });
      form.reset();
      // Reset file in card download
      setReset(true);
      // Reset files of hook
      await resetFiles();
      setReset(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="layout-sidebar py5">
      <main className="stack-large">
        <div className="stack">
          <h4 className="stack-large__title">
            <Icon name="profil" />
            Informations générales
          </h4>
          <form className="level2 stack-large p3" onSubmit={handleSubmit}>
            <Field name="title" type="text" placeholder="">
              Nom de la paire
            </Field>
            <Field name="description" type="textarea" placeholder="">
              Description
            </Field>
            <button
              style={{ display: "none" }}
              type="submit"
              // @ts-ignore
              ref={buttonRef}
            />
          </form>
        </div>
        <div className="stack">
          <h4 className="stack-large__title">
            <Icon name="download" />
            Télécharger vos photos
          </h4>
          <div className="level2 stack-large p3">
            <section className="scan-download">
              <div className="section-title">La paire</div>
              <div className="scans">
                <DownloadCard
                  type="Coté droit"
                  isReset={reset}
                  addFile={addFile}
                  updateFile={changeFile}
                  deleteFile={deleteFile}
                />
                <DownloadCard
                  type="Coté gauche"
                  isReset={reset}
                  addFile={addFile}
                  updateFile={changeFile}
                  deleteFile={deleteFile}
                />
                <DownloadCard
                  type="Devant"
                  isReset={reset}
                  addFile={addFile}
                  updateFile={changeFile}
                  deleteFile={deleteFile}
                />
                <DownloadCard
                  type="Au dessus"
                  isReset={reset}
                  addFile={addFile}
                  updateFile={changeFile}
                  deleteFile={deleteFile}
                />
                <DownloadCard
                  type="Derrière"
                  isReset={reset}
                  addFile={addFile}
                  updateFile={changeFile}
                  deleteFile={deleteFile}
                />
                <DownloadCard
                  type="En dessous"
                  isReset={reset}
                  addFile={addFile}
                  updateFile={changeFile}
                  deleteFile={deleteFile}
                />
              </div>
            </section>
            <section className="scan-download">
              <div className="section-title">La boite</div>
              <div className="scans">
                <DownloadCard
                  type="Devant"
                  isReset={reset}
                  addFile={addFile}
                  updateFile={changeFile}
                  deleteFile={deleteFile}
                />
                <DownloadCard
                  type="Coté tag"
                  isReset={reset}
                  addFile={addFile}
                  updateFile={changeFile}
                  deleteFile={deleteFile}
                />
                <DownloadCard
                  type="Intérieur"
                  isReset={reset}
                  addFile={addFile}
                  updateFile={changeFile}
                  deleteFile={deleteFile}
                />
              </div>
            </section>
            <section className="scan-download">
              <div className="section-title">Documents et autres</div>
              <div className="scans">
                <DownloadCard
                  type="Facture"
                  isReset={reset}
                  addFile={addFile}
                  updateFile={changeFile}
                  deleteFile={deleteFile}
                />
                <DownloadCard
                  type="Lacets"
                  isReset={reset}
                  addFile={addFile}
                  updateFile={changeFile}
                  deleteFile={deleteFile}
                />
                <DownloadCard
                  type="Tags"
                  isReset={reset}
                  addFile={addFile}
                  updateFile={changeFile}
                  deleteFile={deleteFile}
                />
              </div>
            </section>
            <div className="text-right">
              <button
                className="btn-primary"
                onClick={() => buttonRef.current?.click()}
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      </main>
      <aside className="stack-large">
        <div>
          <h5 className="h5 mb2">Besoin d'aide ?</h5>
          <p className="text-light">
            <a className="underline">Clique ici</a> pour accéder à un exemple de
            création de scans.
          </p>
        </div>
        <div>
          <h5 className="h5 mb2">Nous soutenir</h5>
          <div className="">
            <p className="text-light mb2">
              Si tu es satisfait de l’authentification de ta paire ou que tu
              souhaites tout simplement nous aider à développer l’application,
              tu peux nous soutenir en faisant un don.
            </p>
            <a href="#" className="btn-primary">
              Faire un don
            </a>
          </div>
        </div>
        <div>
          <h5 className="h5 mb2">Nous retrouver</h5>
          <div className="list-icons flex">
            <a href="#">
              <Icon name="facebook" width="24" />
            </a>
            <a href="#">
              <Icon name="instagram" width="24" />
            </a>
            <a href="#">
              <Icon name="twitter" width="24" />
            </a>
            <a href="#">
              <Icon name="linkdin" width="24" />
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}
