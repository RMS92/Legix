import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Icon from "../ui/Icon";
import { dateDiff, formatTitle } from "../utils/functions";
import { CommentType, Scan, User } from "../types";
import { apiFetch } from "../utils/api";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useComments } from "../hooks/useComments";
import { ScanCard } from "../ui/Cards";

export default function ProfilActivity() {
  const [page, setPage] = useState("activities");
  const [user, setUser] = useState<User | null>(null);
  // @ts-ignore
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      const res = await apiFetch("/users/" + id);
      setUser(res);
    })();
  }, []);

  // @ts-ignore
  const nbOfDays: string = dateDiff(new Date(user?.created_at), true).split(
    "."
  )[0];

  if (!user) {
    return <></>;
  }

  return (
    <>
      <header className="page-header separated">
        <div className="profil-header">
          <div className="profil-header__icon">
            {user?.avatarFile ? (
              <img
                src={
                  process.env.PUBLIC_URL +
                  `/media/uploads/profil/${user?.username}/${user?.avatarFile.current_filename}`
                }
                alt={`avatar-${user?.username}`}
              />
            ) : (
              <img src="/media/default.png" alt="avatar-default" />
            )}
          </div>
          <div className="profil-header__body">
            <h1 className="h1">{user.username}</h1>
            <p>
              <a href="#" className="badge badge-primary">
                Compte standard
              </a>
              <span className="label-large text-normal">
                Inscrit depuis {nbOfDays}
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
            page === "activities" ? "is-selected" : null
          )}
          onClick={() => setPage("activities")}
        >
          <Icon name="profil" className="icon icon-profil" />
          Activités
        </a>
      </div>
      <ProfilActivityBody user={user} page={page} />
    </>
  );
}

function ProfilActivityBody({ user, page }: { user: User; page: string }) {
  const { comments, fetchUserComments } = useComments();
  const [scans, setScans] = useState<Scan[] | null>(null);

  useEffect(() => {
    (async () => {
      // Fetch scans of user
      const res = await apiFetch("/scans/users/" + user._id);
      setScans(res);

      // Fetch comment of user
      await fetchUserComments(user);
    })();
  }, []);

  return page === "activities" ? (
    <div className="container py5">
      <div className="grid2 gap4">
        <div className="stack">
          <h4 className="h4">Ses derniers scans</h4>
          <div className="scans">
            {scans && scans.map((s: Scan) => <ScanCard key={s._id} scan={s} />)}
          </div>
        </div>
        <div className="stack">
          <h4 className="h4">Ses derniers commentaires</h4>
          <div className="p2 stack-separated">
            {comments &&
              comments.map((c: CommentType) => (
                <CommentWithoutAvatar comment={c} key={c._id} />
              ))}
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

function CommentWithoutAvatar({ comment }: { comment: CommentType }) {
  const nbOfDays: string = dateDiff(new Date(comment.created_at));

  return (
    <div className="comment without-avatar">
      <div className="comment__meta">
        <div className="comment__author">
          <span className="text-muted normal">Sur</span>
          <Link to={`/scans/${comment.scan._id}`}>
            {" "}
            {formatTitle(comment.scan.title)}
          </Link>
        </div>
        <div className="comment__actions">
          <div className="comment__date">
            <Link to={`/scans/${comment.scan._id}`}>{nbOfDays}</Link>
          </div>
        </div>
      </div>
      <div className="comment__content">
        <p>{comment.content}</p>
      </div>
    </div>
  );
}
