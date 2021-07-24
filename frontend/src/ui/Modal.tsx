import React, { useRef } from "react";
import Icon from "./Icon";
import { useClickOutside } from "../hooks/useClickOutside";
import SlideIn from "./animations/SlideIn";

export function Modal({
  title,
  visible,
  onClose,
  children,
}: {
  title: string | JSX.Element;
  visible: boolean;
  onClose: Function;
  children: any;
}) {
  return (
    <SlideIn show={visible} className="modal">
      <div className="modal__wrapper" onClick={() => onClose("")} />
      <div className="modal__body">
        <div className="modal__close">
          <Icon
            name="cross"
            width="12"
            className="icon icon-cross"
            onClick={() => onClose("")}
          />
        </div>
        <div className="modal__head">
          <div className="modal__title">{title}</div>
        </div>
        <div className="modal__content">{children}</div>
      </div>
    </SlideIn>
  );
}

export function MoreModal({
  object,
  onClick,
  onEdit,
  onDelete,
}: {
  object: any;
  onClick: () => void;
  onEdit: Function;
  onDelete: Function;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, onClick);

  const handleDelete = async () => {
    await onDelete(object);
  };

  return (
    <div ref={ref}>
      <div className="modal-more">
        <div className="modal-more__wrapper">
          <Icon
            name="cross"
            className="icon icon-cross"
            onClick={() => onClick()}
          />
          <div className="modal-edit" onClick={() => onEdit()}>
            <Icon name="edit" />
            Editer
          </div>
          <div className="modal-delete" onClick={handleDelete}>
            <Icon name="delete" className="icon icon-delete" />
            Supprimer
          </div>
        </div>
      </div>
    </div>
  );
}
