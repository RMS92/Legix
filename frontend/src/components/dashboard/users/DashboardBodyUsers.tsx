import { useDashboardContext } from "../../../contexts/DashboardContext";
import React, { SyntheticEvent, useState } from "react";
import { User } from "../../../types";
import Icon from "../../../ui/Icon";
import clsx from "clsx";
import { MoreModal } from "../../../ui/Modal";
import Pagination from "../../../ui/Pagination";
import SlideIn from "../../../ui/animations/SlideIn";

export default function DashboardBodyUsers() {
  const { setPage, users, deleteUser } = useDashboardContext();
  const [currentModal, setCurrentModal] = useState<string>("");
  const [paginationItems, setPaginationItems] = useState<User[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const filteredUsers = (users || []).filter((u) =>
    searchValue === "" ||
    u.email.toLowerCase().includes(searchValue.toLowerCase())
      ? u
      : ""
  );

  const handleChange = (e: SyntheticEvent) => {
    // @ts-ignore
    setSearchValue(e.target.value);
  };

  const closeModal = (): void => {
    setCurrentModal("");
  };

  if (users === null) {
    return <></>;
  }
  return (
    <>
      <div className="dashboard-head">
        <h4 className="h4">
          <Icon name="bigUser" />
          Utilisateurs
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
                <th>Nom Prénom</th>
                <th>Email</th>
                <th>Roles</th>
                <th>Dernière connexion</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {paginationItems.map((u, i) => (
                <tr key={u._id}>
                  <td>{u.full_name}</td>
                  <td>{u.email}</td>
                  <td>{u.roles}</td>
                  <td>04-05-2021</td>
                  <td style={{ width: "20px" }}>
                    <Icon
                      name="more"
                      className="icon icon-more"
                      onClick={() => {
                        setCurrentModal(u._id);
                      }}
                    />
                    <SlideIn
                      className="table__modal"
                      show={currentModal === u._id}
                    >
                      <MoreModal
                        object={u}
                        onDelete={deleteUser}
                        onClick={closeModal}
                        onEdit={() => setPage("users/edit")}
                      />
                    </SlideIn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="dashboard-tab__footer">
          <Pagination
            items={filteredUsers}
            itemsPerPage={9}
            totalItems={filteredUsers.length}
            setPaginationItems={setPaginationItems}
          />
        </div>
      </div>
    </>
  );
}
