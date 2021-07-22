import { useDashboardContext } from "../../../contexts/DashboardContext";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { Scan } from "../../../types";
import Icon from "../../../ui/Icon";
import { formatTitle } from "../../../utils/functions";
import { ScanStatus } from "../../../ui/Utils";
import Checkbox from "../../../ui/Checkbox";
import clsx from "clsx";
import { MoreModal } from "../../../ui/Modal";
import Pagination from "../../../ui/Pagination";
import SlideIn from "../../../ui/animations/SlideIn";

export default function DashboardBodyScans() {
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

  const closeModal = (): void => {
    setCurrentModal("");
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
                      type="confirm"
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
                    <SlideIn
                      className="table__modal"
                      show={currentModal === s._id}
                    >
                      <MoreModal
                        object={s}
                        onClick={closeModal}
                        onEdit={() => handleClick(s, "scans/edit")}
                        onDelete={deleteScan}
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
