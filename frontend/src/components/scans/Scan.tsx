import React, { SyntheticEvent, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Icon from "../../ui/Icon";
import clsx from "clsx";
import Field from "../../ui/Field";
import { apiFetch, formToObject } from "../../utils/api";
import { dateDiff, formatTitle } from "../../utils/functions";
import {
  FileTextStatus,
  ScanBadgeStatus,
  ScanTextStatus,
} from "../../ui/Utils";
import { Modal } from "../../ui/Modal";
import { useScanContext } from "../../contexts/ScanContext";
import { FileCard } from "../../ui/Cards";
import { ScanFile } from "../../types";
import Comment from "../comments/Comment";
import { useComments } from "../../hooks/useComments";
import { CommentType } from "../../types";
import ScanInfo from "../../ui/ScanInfo";
import SlideIn from "../../ui/animations/SlideIn";
import Fade from "../../ui/animations/Fade";

export default function ScanDetails() {
  const {
    page,
    setPage,
    modal,
    setModal,
    scan,
    setScan,
    selectedFile,
    unselectFile,
  } = useScanContext();
  // @ts-ignore
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      const res = await apiFetch("/scans/" + id);
      setScan(res);
    })();
  }, []);

  if (!scan) {
    return <></>;
  }

  return (
    <>
      {selectedFile ? (
        <Modal
          title={<FileTextStatus status={selectedFile.status} />}
          visible={modal === "files/view"}
          onClose={(page: string) => {
            setModal(page);
            const timer = setTimeout(() => {
              unselectFile();
            }, 300);
            return () => {
              clearTimeout(timer);
            };
          }}
        >
          <div className="grid2">
            <div className="stack pt3">
              <img
                src={
                  process.env.PUBLIC_URL +
                  `/media/uploads/scans/${scan.user.username}/${selectedFile.current_filename}`
                }
                alt={selectedFile.current_filename}
              />
            </div>
          </div>
        </Modal>
      ) : null}
      <header className="page-header separated">
        <div className="profil-header">
          <div className="profil-header__avatar">
            <Icon name="home-illustration" width="100" />
          </div>
          <div className="profil-header__body">
            <h1 className="h1">{formatTitle(scan.title)}</h1>
            <h5 className="h5">
              <span className="normal">Scan de</span> {scan.user.username}
              {page === "scan" ? (
                <ScanBadgeStatus status={scan.status} />
              ) : page === "stats" ? (
                <a className="badge badge-info">Statistiques</a>
              ) : null}
            </h5>
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
          <Icon name="badge" className="icon icon-badge" />
          Review
        </a>
        <a
          href="#"
          className={clsx(
            "h5 normal icon-verticalAlign",
            page === "stats" ? "is-selected" : null
          )}
          onClick={() => setPage("stats")}
        >
          <Icon name="stats" className="icon icon-stats" />
          Statistiques
        </a>
      </div>
      <ScanBody />
    </>
  );
}

function ScanBody() {
  const { page } = useScanContext();

  return page === "scan" ? <ScanBodyReview /> : null;
}

function ScanBodyReview() {
  const { user, setModal, scan, fetchFile } = useScanContext();
  const {
    comments,
    fetchScanComments,
    createComment,
    updateComment,
    deleteComment,
  } = useComments();

  const nbOfDays = dateDiff(new Date(scan.created_at));

  const files = (scan.scanFiles || []).sort(
    (a: ScanFile, b: ScanFile) => a.position - b.position
  );

  const parentsComments = (comments || []).filter(
    (c: CommentType) => !c.parent
  );

  const childrenComments = (comments || []).filter(
    (c: CommentType) => c.parent
  );

  useEffect(() => {
    (async () => {
      await fetchScanComments(scan);
    })();
  }, []);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const form: HTMLFormElement = e.target as HTMLFormElement;
    const data: object = formToObject(form);
    Object.assign(data, { scan: scan._id });

    try {
      await createComment(data);
      form.reset();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="layout-sidebar py5">
      <main className="stack-large">
        <div className="stack">
          <h4 className="stack-large__title">
            <Icon name="description" />
            Description
          </h4>
          <div className="level1 stack-large p3">{scan.description}</div>
        </div>
        <div className="stack">
          <h4 className="stack-large__title">
            <Icon name="photo" height="29" />
            Les photos
          </h4>
          <div className="level1 stack-large p3">
            <ScanInfo
              files={files}
              selectedScan={scan}
              fetchFile={fetchFile}
              setModal={setModal}
              category="La paire"
              mode="view"
              min={0}
              max={6}
            />
            <ScanInfo
              files={files}
              selectedScan={scan}
              fetchFile={fetchFile}
              setModal={setModal}
              category="La boite"
              mode="view"
              min={7}
              max={9}
            />
            <ScanInfo
              files={files}
              selectedScan={scan}
              fetchFile={fetchFile}
              setModal={setModal}
              category="Documents et accessoires"
              mode="view"
              min={10}
              max={12}
            />
          </div>
        </div>
        <div className="comment-area">
          <div className="comments__title">
            {comments ? comments.length : null} commentaires
          </div>
          <form className="grid" onSubmit={handleSubmit}>
            <div className="full">
              <Field name="content" type="textarea">
                Votre message
              </Field>
            </div>
            <div className="hstack">
              {user && user._id ? (
                <button className="btn-primary" type="submit">
                  Envoyer
                </button>
              ) : (
                <Link to="/connexion" className="btn-primary">
                  Se connecter
                </Link>
              )}
            </div>
          </form>
          <hr />
          <div className="comment-list">
            {parentsComments.map((c: CommentType) => (
              <Comment
                key={c._id}
                childrenComments={childrenComments}
                comment={c}
                onCreate={createComment}
                onUpdate={updateComment}
                onDelete={deleteComment}
              />
            ))}
          </div>
        </div>
      </main>
      <aside className="">
        <div className="stack-large">
          <div className="text-right">
            <small className="text-muted">{nbOfDays}</small>
          </div>
          <div>
            <h5 className="h5 mb2">Résultat de l'expertise</h5>
            <div className="list-group">
              <ScanTextStatus status={scan.status} />
            </div>
          </div>
          <div>
            <div className="flex">
              <Icon name="roundedUser" width="40" className="mr2" />
              <div>
                <strong className="bold">Expert:</strong>
                <br />
                <a href="#">Roromain</a>
              </div>
            </div>
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
        </div>
      </aside>
    </div>
  );
}
