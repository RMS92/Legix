import React from "react";
import clsx from "clsx";
import { useDashboardContext } from "../../contexts/DashboardContext";
import DashboardBody from "./DashboardBody";
import ModalScanFileEdit from "../modals/ModalScanFileEdit";
import ModalScanFileView from "../modals/ModalScanFileView";
import Icon from "../../ui/Icon";

export default function Dashboard() {
  const { page, setPage, modal } = useDashboardContext();

  return (
    <>
      {modal === "files/view" ? (
        <ModalScanFileView />
      ) : modal === "files/edit" ? (
        <ModalScanFileEdit />
      ) : null}
      <div className="container">
        <div className="layout-dashboard">
          <aside className="dashboard-sidebar">
            <div className="dashboard-sidebar__wrapper">
              <div className="dashboard-sidebar__main">
                <h5 className="h6">Main nav</h5>
                <ul>
                  <li>
                    <a
                      href="#"
                      className={clsx(
                        page === "dashboard" ? "is-active" : null
                      )}
                      onClick={() => setPage("dashboard")}
                    >
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className={clsx(page === "pages" ? "is-active" : null)}
                      onClick={() => setPage("pages")}
                    >
                      Pages
                    </a>
                  </li>
                </ul>

                <h5 className="h6">Components</h5>
                <ul>
                  <li>
                    <a
                      href="#"
                      className={clsx(page === "users" ? "is-active" : null)}
                      onClick={() => setPage("users")}
                    >
                      Utilisateurs
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className={clsx(
                        page === "scans" ||
                          page === "scans/view" ||
                          page === "scans/edit"
                          ? "is-active"
                          : null
                      )}
                      onClick={() => setPage("scans")}
                    >
                      Scans
                    </a>
                  </li>
                </ul>
                <h5 className="h6">More</h5>
                <ul>
                  <li>
                    <div className="flex">
                      <a
                        href="#"
                        className={clsx(
                          page === "notifications" ||
                            page === "notifications/create" ||
                            page === "notifications/edit"
                            ? "is-active"
                            : null
                        )}
                        onClick={() => setPage("notifications")}
                      >
                        Notifications
                      </a>
                      <Icon
                        name="add"
                        className="icon icon-plus"
                        width="16"
                        onClick={() => {
                          setPage("notifications/create");
                        }}
                      />
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
          <DashboardBody />
        </div>
      </div>
    </>
  );
}
