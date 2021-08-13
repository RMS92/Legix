import React, {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import SlideIn from "./animations/SlideIn";
import { useClickOutside } from "../hooks/useClickOutside";
import clsx from "clsx";
import { usePrepend } from "../hooks/usePrepend";
import { NotificationType, User } from "../types";
import { apiFetch } from "../utils/api";
import { dateDiff } from "../utils/functions";
import { useUpdateEffect } from "../hooks/useUpdateEffect";
import Spinner from "./Spinner";

const OPEN = 0;
const CLOSE = 1;
let notificationCache: NotificationType[] = [];
let notificationLoaded = false;

function countUnread(notification: NotificationType[]) {
  return notification.filter((n) => {
    return !n.read_at;
  }).length;
}

export default function Notifications({
  user,
  onConnect,
}: {
  user: User | null;
  onConnect: Dispatch<SetStateAction<boolean>>;
}) {
  const [notifications, setNotifications] = usePrepend([]);
  const [count, setCount] = useState(0);
  const [state, setState] = useState(CLOSE);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(!notificationLoaded);

  useEffect(() => {
    (async () => {
      const res = await apiFetch("/notifications/users");
      for (let i = res.length - 1; i >= 0; i -= 1) {
        setNotifications(res[i]);
      }
      setLoading(false);
    })();
  }, [onConnect]);

  useEffect(() => {
    (async () => {
      const eventSource = new EventSource(
        "http://localhost:3333/api/notifications/sse",
        { withCredentials: true }
      );
      eventSource.onmessage = ({ data }) => {
        const eventNotification = JSON.parse(data);
        if (
          (!eventNotification.user && eventNotification.channel === "public") ||
          (eventNotification.user === user?._id &&
            eventNotification.channel === "private")
        ) {
          setNotifications(eventNotification);
          setCount((nb) => nb + 1);
        }
      };
    })();
  }, []);

  useUpdateEffect(() => {
    setCount(countUnread(notifications));
  }, [notifications]);

  const openMenu = async (e: SyntheticEvent) => {
    e.preventDefault();
    setState(OPEN);
    setIsActive(true);
    if (count > 0) {
      await apiFetch("/notifications/read", { method: "post" });
      setCount(0);
    }
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
      <Badge count={count} />
      <SlideIn className="notifications" show={state === OPEN}>
        <Popup
          notifications={notifications}
          onClickOutside={closeMenu}
          loading={loading}
        />
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
  notifications: NotificationType[];
  loading: boolean;
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
        {loading ? (
          <div className="notifications__body-empty flex flex-center">
            <Spinner />
          </div>
        ) : null}
        {notifications.length === 0 ? (
          <span className="notifications__body-empty">
            Vous n'avez aucune notification :(
          </span>
        ) : (
          notifications.map((n: NotificationType) => (
            <Notification key={n._id} notification={n} />
          ))
        )}
      </div>
      <Link to="/notifications" className="notifications__footer">
        Toutes mes notifications
      </Link>
    </div>
  );
}

function Notification({ notification }: { notification: NotificationType }) {
  // const isRead = notificationReadAt > createdAt;
  // const className = `notifications__item ${isRead ? "is-read" : ""}`;
  // const time = Date.parse(createdAt) / 1000;
  // eslint-disable-next-line react/no-danger
  return (
    <a href={notification.url} className="notifications__item">
      <div dangerouslySetInnerHTML={{ __html: notification.message }} />
      <small className="text-muted">
        {dateDiff(new Date(notification.created_at))}
      </small>
    </a>
  );
}
