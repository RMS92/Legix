import React, { useEffect, useState } from "react";
import { NotificationType } from "../types";
import { apiFetch } from "../utils/api";
import { dateDiff } from "../utils/functions";

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  useEffect(() => {
    (async () => {
      const res = await apiFetch("/notifications/users");
      setNotifications(res);
    })();
  }, []);

  return (
    <>
      <header className="page-header container">
        <h1 className="h1">Mes notifications</h1>
      </header>
      <div className="container py5">
        <div className="stack-separated">
          {notifications.map((n: NotificationType) => (
            <Notification notification={n} key={n._id} />
          ))}
        </div>
      </div>
    </>
  );
}

function Notification({ notification }: { notification: NotificationType }) {
  return (
    <div>
      <p>
        <a
          className="formatted ignore-br"
          href={notification.url}
          dangerouslySetInnerHTML={{ __html: notification.message }}
        />
      </p>
      <div className="text-muted text-small">
        {dateDiff(new Date(notification.created_at))}
      </div>
    </div>
  );
}
