import { useDashboardContext } from "../../contexts/DashboardContext";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { User } from "../../types";
import Icon from "../../ui/Icon";
import clsx from "clsx";
import { MoreModal } from "../../ui/Modal";
import Pagination from "../../ui/Pagination";
import { Scan } from "../../types";
import Checkbox from "../../ui/Checkbox";
import { formatTitle } from "../../utils/functions";
import { ScanStatus } from "../../ui/Utils";
import { ScanFile } from "../../types";
import { FileCard } from "../../ui/Cards";

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
      ) : null}
    </main>
  );
}

function DashboardBodyUsers() {
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
                    <div
                      className={clsx(
                        "table__modal",
                        currentModal !== u._id ? "is-hidden" : "is-display"
                      )}
                    >
                      <MoreModal
                        object={u}
                        onDelete={deleteUser}
                        onClick={setCurrentModal}
                        onEdit={() => setPage("users/edit")}
                      />
                    </div>
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

function DashboardBodyScans() {
  const {
    setPage,
    scans,
    selectedScan,
    fetchScan,
    updateScan,
    deleteScan,
    unselectScan,
  } = useDashboardContext();
  const [currentModal, setCurrentModal] = useState<string>("");
  const [paginationItems, setPaginationItems] = useState<Scan[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const filteredScans = (scans || []).filter((s: Scan) =>
    searchValue === "" ||
    s.title.toLowerCase().includes(searchValue.toLowerCase())
      ? s
      : ""
  );

  useEffect(() => {
    if (selectedScan) {
      unselectScan();
    }
  }, []);

  const handleClick = (scan: Scan, page: string) => {
    fetchScan(scan, "select");
    setPage(page);
  };

  const handleChange = (e: SyntheticEvent) => {
    // @ts-ignore
    setSearchValue(e.target.value);
  };

  if (!scans) {
    return <></>;
  }

  return (
    <>
      <div className="dashboard-head">
        <h4 className="h4">
          <Icon name="badge" />
          Scans
        </h4>
        <div className="dashboard-head__search">
          <form className="dashboard-searchField">
            <input
              type="search"
              name="search"
              placeholder="e.g. titre"
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
                <th>
                  <div className="table__sortable">
                    Titre <Icon name="arrowSort" />
                  </div>
                </th>
                <th>Status</th>
                <th>Visible</th>
                <th>Date de création</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {paginationItems.map((s, i) => (
                <tr key={s._id}>
                  <td>
                    <a href="#" onClick={() => handleClick(s, "scans/view")}>
                      {formatTitle(s.title)}
                    </a>
                  </td>
                  <td>
                    <ScanStatus status={s.status} />
                  </td>
                  <td>
                    <Checkbox
                      object={s}
                      state={s.is_visible}
                      onUpdate={updateScan}
                    />
                  </td>
                  <td>{s.created_at}</td>
                  <td style={{ width: "20px" }}>
                    <Icon
                      name="more"
                      className="icon icon-more"
                      onClick={() => {
                        setCurrentModal(s._id);
                      }}
                    />
                    <div
                      className={clsx(
                        "table__modal",
                        currentModal !== s._id ? "is-hidden" : "is-display"
                      )}
                    >
                      <MoreModal
                        object={s}
                        onClick={setCurrentModal}
                        onEdit={() => handleClick(s, "scans/edit")}
                        onDelete={deleteScan}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="dashboard-tab__footer">
          <Pagination
            items={filteredScans}
            itemsPerPage={10}
            totalItems={filteredScans.length}
            setPaginationItems={setPaginationItems}
          />
        </div>
      </div>
    </>
  );
}

function DashboardBodyScansView() {
  const { setModal, selectedScan, fetchFile } = useDashboardContext();
  return (
    <main className="stack-large">
      <div className="stack">
        <h4 className="stack-large__title">
          <Icon name="badge" />
          {formatTitle(selectedScan.title)} -&nbsp;
          <ScanStatus status={selectedScan.status} />
        </h4>
        <div className="level1 stack-large p3">
          <div className="form-group">
            <label htmlFor="title">Nom de la paire</label>
            <input
              name="title"
              id="title"
              type="text"
              value={selectedScan.title}
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              value={selectedScan.description}
              readOnly
            />
          </div>
        </div>
      </div>
      <div className="stack">
        <h4 className="stack-large__title">
          <Icon name="photo" />
          Photos
        </h4>
        <div className="level1 stack-large p3">
          <section className="scan-info">
            <div className="section-title">La paire</div>
            <div className="scans">
              {selectedScan.scanFiles.slice(0, 6).map((f: ScanFile) => (
                <FileCard
                  key={f._id}
                  scan={selectedScan}
                  file={f}
                  fetchFile={fetchFile}
                  modalName="files/view"
                  setModal={setModal}
                />
              ))}
            </div>
          </section>
          <section className="scan-info">
            <div className="section-title">La boite</div>
            <div className="scans">
              {selectedScan.scanFiles.slice(6, 9).map((f: ScanFile) => (
                <FileCard
                  key={f._id}
                  scan={selectedScan}
                  file={f}
                  fetchFile={fetchFile}
                  modalName="files/view"
                  setModal={setModal}
                />
              ))}
            </div>
          </section>
          <section className="scan-info">
            <div className="section-title">Documents et accessoires</div>
            <div className="scans">
              {selectedScan.scanFiles.slice(9, 12).map((f: ScanFile) => (
                <FileCard
                  key={f._id}
                  scan={selectedScan}
                  file={f}
                  fetchFile={fetchFile}
                  modalName="files/view"
                  setModal={setModal}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function DashboardBodyScansEdit() {
  const {
    setModal,
    selectedScan,
    fetchScan,
    updateScan,
    selectedFile,
    fetchFile,
  } = useDashboardContext();
  const [init, setInit] = useState(false);
  const [fields, setFields] = useState({
    title: formatTitle(selectedScan.title),
    description: selectedScan.description,
    status: selectedScan.status,
  });

  useEffect(() => {
    (async () => {
      if (!selectedFile && init) {
        await fetchScan(selectedScan, "fetch");
      }
      setInit(true);
    })();
  }, [selectedFile]);

  const handleChange = (e: SyntheticEvent) => {
    // @ts-ignore
    const value = e.target.value;
    // @ts-ignore
    setFields({ ...fields, [e.target.name]: value });
  };

  const handleSubmit = async () => {
    Object.assign(fields, { status: Number(fields.status) });
    try {
      await updateScan(selectedScan, fields);
    } catch (err) {
      console.log(err);
    }
  };

  if (!selectedScan) {
    return <></>;
  }

  return (
    <main className="stack-large">
      <div className="stack">
        <h4 className="stack-large__title">
          <Icon name="badge" />
          {formatTitle(selectedScan.title)}
        </h4>
        <div className="level1 stack-large p3">
          <div className="form-group">
            <label htmlFor="title">Nom de la paire</label>
            <input
              name="title"
              id="title"
              type="text"
              value={fields.title}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              value={fields.description}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <input
              name="status"
              id="status"
              type="status"
              value={fields.status}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className="stack">
        <h4 className="stack-large__title">
          <Icon name="photo" />
          Photos
        </h4>
        <div className="level1 stack-large p3">
          <section className="scan-info">
            <div className="section-title">La paire</div>
            <div className="scans">
              {selectedScan.scanFiles.slice(0, 6).map((f: ScanFile) => (
                <FileCard
                  key={f._id}
                  scan={selectedScan}
                  file={f}
                  fetchFile={fetchFile}
                  modalName="files/edit"
                  setModal={setModal}
                />
              ))}
            </div>
          </section>
          <section className="scan-info">
            <div className="section-title">La boite</div>
            <div className="scans">
              {selectedScan.scanFiles.slice(6, 9).map((f: ScanFile) => (
                <FileCard
                  key={f._id}
                  scan={selectedScan}
                  file={f}
                  fetchFile={fetchFile}
                  modalName="files/edit"
                  setModal={setModal}
                />
              ))}
            </div>
          </section>
          <section className="scan-info">
            <div className="section-title">Documents et accessoires</div>
            <div className="scans">
              {selectedScan.scanFiles.slice(6, 9).map((f: ScanFile) => (
                <FileCard
                  key={f._id}
                  scan={selectedScan}
                  file={f}
                  fetchFile={fetchFile}
                  modalName="files/edit"
                  setModal={setModal}
                />
              ))}
            </div>
          </section>
          <div className="text-right">
            <button className="btn-primary" onClick={handleSubmit}>
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
