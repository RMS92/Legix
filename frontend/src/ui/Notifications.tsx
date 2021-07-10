import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import SlideIn from "./animations/SlideIn";
import { useClickOutside } from "../hooks/useClickOutside";
import clsx from "clsx";

const OPEN = 0;
const CLOSE = 1;
let notificationsLoaded = false;

export default function Notifications() {
  const [state, setState] = useState(CLOSE);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource(
      "http://localhost:3333/api/notifications/sse"
    );
    eventSource.onmessage = ({ data }) => {
      console.log("New message", data);
    };
  }, []);

  const openMenu = (e: SyntheticEvent) => {
    e.preventDefault();
    setState(OPEN);
    setIsActive(true);
  };

  const closeMenu = () => {
    setState(CLOSE);
    setIsActive(false);
  };

  return (
    <>
      <button
        onClick={openMenu}
        className="flex alignItems-center"
        type="button"
        aria-label="Voir les notifications"
      >
        <Icon
          name="bell"
          className={clsx("icon icon-bell", isActive ? "bell-active" : null)}
        />
      </button>
      <Badge count={2} />
      <SlideIn className="notifications" show={state === OPEN}>
        <Popup notifications={[]} onClickOutside={closeMenu} />
      </SlideIn>
    </>
  );
}

function Badge({ count }: { count: number }) {
  return count > 0 ? (
    <span className="notifications-badge">{count}</span>
  ) : null;
}

function Popup({
  notifications,
  loading,
  onClickOutside,
}: {
  notifications: [];
  loading?: false;
  onClickOutside: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, onClickOutside);

  return (
    <div ref={ref}>
      <div className="notifications__title">
        Nouveaux messages
        <button aria-label="Fermer" onClick={onClickOutside}>
          <Icon name="cross" />
        </button>
      </div>
      <div className="notifications__body">
        {notifications.length === 0 ? (
          <span className="notifications__body-empty">
            Vous n'avez aucune notification :(
          </span>
        ) : (
          notifications.map((n, i) => <Notification key={i} {...n} />)
        )}
      </div>
      <Link to="/notifications" className="notifications__footer">
        Toutes mes notifications
      </Link>
    </div>
  );
}

function Notification({
  url,
  message,
  createdAt,
  notificationReadAt,
}: {
  url: string;
  message: string;
  createdAt: Date;
  notificationReadAt: Date;
}) {
  const isRead = notificationReadAt > createdAt;
  const className = `notifications__item ${isRead ? "is-read" : ""}`;
  // const time = Date.parse(createdAt) / 1000;
  // eslint-disable-next-line react/no-danger
  return (
    <a href={url} className={className}>
      <div dangerouslySetInnerHTML={{ __html: message }} />
      <small className="text-muted" />
    </a>
  );
}
