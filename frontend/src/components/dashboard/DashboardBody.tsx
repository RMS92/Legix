import { useDashboardContext } from "../../contexts/DashboardContext";
import React, { SyntheticEvent, useState } from "react";
import Icon from "../../ui/Icon";
import { MoreModal } from "../../ui/Modal";
import DashboardBodyUsers from "./users/DashboardBodyUsers";
import DashboardBodyScans from "./scans/DashboardBodyScans";
import DashboardBodyScansView from "./scans/DashboardBodyScansView";
import DashboardBodyScansEdit from "./scans/DashboardBodyScansEdit";
import SlideIn from "../../ui/animations/SlideIn";
import { NotificationType, Scan } from "../../types";

export default function DashboardBody() {
  const { page } = useDashboardContext();
  return (
    <main className="py5">
      {page === "users" ? (
        <DashboardBodyUsers />
      ) : page === "scans" ? (
        <DashboardBodyScans />
      ) : page === "scans/view" ? (
        <DashboardBodyScansView />
      ) : page === "scans/edit" ? (
        <DashboardBodyScansEdit />
      ) : page === "notifications" ? (
        <DashboardBodyNotifications />
      ) : page === "notifications/create" ? (
        <DashboardBodyNotificationsCreate />
      ) : page === "notifications/edit" ? (
        <DashboardBodyNotificationsEdit />
      ) : null}
    </main>
  );
}

function DashboardBodyNotifications() {
  const { setPage, notifications, fetchNotification, deleteNotification } =
    useDashboardContext();
  const [currentModal, setCurrentModal] = useState<string>("");
  const filteredNotifications = (notifications || []).filter((n) => n._id);

  const handleChange = () => {};

  const handleClick = async (notification: NotificationType, page: string) => {
    await fetchNotification(notification, "select");
    setPage(page);
  };

  const closeModal = (): void => {
    setCurrentModal("");
  };

  return (
    <>
      <div className="dashboard-head">
        <h4 className="h4">
          <Icon name="bell" width="20" />
          Notifications
        </h4>
        <div className="dashboard-head__search">
          <form className="dashboard-searchField">
            <input
              type="search"
              name="search"
              placeholder="e.g. email"
              onChange={handleChange}
            />
            <button title="search">
              <Icon name="search" />
            </button>
          </form>
        </div>
      </div>
      <div className="dashboard-tab">
        <div className="dashboard-tab__body">
          <table className="table">
            <thead>
              <tr>
                <th>Message</th>
                <th>Url</th>
                <th>Type</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredNotifications.map((n, i) => (
                <tr key={n._id}>
                  <td>{n.message}</td>
                  <td>{n.url}</td>
                  <td>{n.channel}</td>
                  <td style={{ width: "20px" }}>
                    <Icon
                      name="more"
                      className="icon icon-more"
                      onClick={() => {
                        setCurrentModal(n._id);
                      }}
                    />
                    <SlideIn
                      className="table__modal"
                      show={currentModal === n._id}
                    >
                      <MoreModal
                        object={n}
                        onDelete={deleteNotification}
                        onClick={closeModal}
                        onEdit={() => handleClick(n, "notifications/edit")}
                      />
                    </SlideIn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="dashboard-tab__footer" />
      </div>
    </>
  );
}

function DashboardBodyNotificationsCreate() {
  const { createNotification } = useDashboardContext();
  const [fields, setFields] = useState({
    message: "Sujet</br><strong>Titre</strong>",
    url: "http://localhost:3000/",
  });

  const handleSubmit = async () => {
    try {
      await createNotification(fields);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e: SyntheticEvent) => {
    // @ts-ignore
    const value = e.target.value;
    // @ts-ignore
    setFields({ ...fields, [e.target.name]: value });
  };

  return (
    <main className="stack-large">
      <div className="stack">
        <h4 className="stack-large__title">
          <Icon name="bell" />
          Envoyer une notification
        </h4>
        <div className="level1 stack-large p3">
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <input
              name="message"
              id="message"
              type="text"
              value={fields.message}
              placeholder="Entrer votre message"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="url">Url</label>
            <input
              name="url"
              id="url"
              value={fields.url}
              onChange={handleChange}
            />
          </div>
          <div className="text-right">
            <button className="btn-primary" onClick={handleSubmit}>
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function DashboardBodyNotificationsEdit() {
  const { notifications, selectedNotification, updateNotification } =
    useDashboardContext();
  const [fields, setFields] = useState({
    message: selectedNotification.message,
    url: selectedNotification.url,
  });

  const handleChange = (e: SyntheticEvent) => {
    // @ts-ignore
    const value = e.target.value;
    // @ts-ignore
    setFields({ ...fields, [e.target.name]: value });
  };

  const handleSubmit = async () => {
    try {
      await updateNotification(selectedNotification, fields);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="stack-large">
      <div className="stack">
        <h4 className="stack-large__title">
          <Icon name="bell" />
          {selectedNotification._id} - Editer
        </h4>
        <div className="level1 stack-large p3">
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <input
              name="message"
              id="message"
              type="text"
              value={fields.message}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="url">Url</label>
            <input
              name="url"
              id="url"
              value={fields.url}
              onChange={handleChange}
            />
          </div>
          <div className="text-right">
            <button className="btn-primary" onClick={handleSubmit}>
              Modifier
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
