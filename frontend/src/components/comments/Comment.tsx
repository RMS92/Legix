import React, { SyntheticEvent } from "react";
import Icon from "../../ui/Icon";
import { CommentType } from "../../types";
import { useToggle } from "../../hooks/useToogle";
import Field from "../../ui/Field";
import { formToObject } from "../../utils/api";
import { useScanContext } from "../../contexts/ScanContext";
import { dateDiff } from "../../utils/functions";
import SlideIn from "../../ui/animations/SlideIn";
import Fade from "../../ui/animations/Fade";

export default function Comment({
  childrenComments,
  comment,
  onCreate,
  onUpdate,
  onDelete,
}: {
  childrenComments?: CommentType[];
  comment: CommentType;
  onCreate: Function;
  onUpdate: Function;
  onDelete: Function;
}) {
  const { user, scan } = useScanContext();

  const [reply, setReply] = useToggle(false);
  const nbOfDays: string = dateDiff(new Date(comment.created_at));

  const filteredComments = (childrenComments || []).filter(
    (c: CommentType) => c.parent._id === comment._id
  );

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const form: HTMLFormElement = e.target as HTMLFormElement;
    const data: object = formToObject(form);
    Object.assign(data, { parent: comment._id, scan: scan._id });

    try {
      const newComment = await onCreate(data);

      const ids: string[] = [];
      // @ts-ignore
      ids.push(newComment._id);
      // @ts-ignore
      comment.replies.map((c: CommentType) => ids.push(c));

      await onUpdate(comment, { replies: ids });

      form.reset();
      setReply();
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(comment);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="comment">
      <Icon name="roundedUser" width="40" className="comment__avatar" />
      <div className="comment__meta">
        <div className="comment__author">{comment.author.username}</div>
        <div className="comment__actions">
          <a className="comment__date">{nbOfDays}</a>
          {user && (
            <a className="comment__answer" onClick={() => setReply()}>
              <Icon name="reply" width="14" className="icon icon-reply" />
              Répondre
            </a>
          )}
          {user?.username === comment.author.username ? (
            <a className="text-danger" onClick={handleDelete}>
              Supprimer
            </a>
          ) : null}
        </div>
      </div>
      <div className="comment__content">
        <div className="formatted">
          <p>{comment.content}</p>
        </div>
      </div>
      <div className="comment__replies">
        {filteredComments.length !== 0
          ? filteredComments.map((c: CommentType) => (
              <Comment
                key={c._id}
                childrenComments={childrenComments}
                comment={c}
                onCreate={onCreate}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))
          : null}
        <Fade
          visible={reply}
          duration={300}
          from={{ opacity: 0 }}
          animateEnter={false}
        >
          <form className="grid" onSubmit={handleSubmit}>
            <div className="full">
              <Field name="content" type="textarea">
                Votre message
              </Field>
            </div>
            <div className="hstack">
              <button className="btn-primary" type="submit">
                Envoyer
              </button>
              <button
                className="btn-secondary"
                type="button"
                onClick={() => setReply()}
              >
                Annuler
              </button>
            </div>
          </form>
        </Fade>
      </div>
    </div>
  );
}
