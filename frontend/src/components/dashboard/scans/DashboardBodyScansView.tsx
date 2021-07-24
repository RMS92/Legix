import React from "react";
import { useDashboardContext } from "../../../contexts/DashboardContext";
import Icon from "../../../ui/Icon";
import { formatTitle } from "../../../utils/functions";
import { ScanStatus } from "../../../ui/Utils";
import { ScanFile } from "../../../types";
import ScanInfo from "../../../ui/ScanInfo";

export default function DashboardBodyScansView() {
  const { setModal, selectedScan, fetchFile } = useDashboardContext();

  const files = (selectedScan.scanFiles || []).sort(
    (a: ScanFile, b: ScanFile) => a.position - b.position
  );

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
            <label htmlFor="username">Utilisateur</label>
            <input
              name="username"
              id="username"
              value={selectedScan.user.username}
              readOnly
            />
          </div>
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
          <ScanInfo
            files={files}
            selectedScan={selectedScan}
            fetchFile={fetchFile}
            setModal={setModal}
            category="La paire"
            mode="view"
            min={0}
            max={6}
          />
          <ScanInfo
            files={files}
            selectedScan={selectedScan}
            fetchFile={fetchFile}
            setModal={setModal}
            category="La boite"
            mode="view"
            min={7}
            max={9}
          />
          <ScanInfo
            files={files}
            selectedScan={selectedScan}
            fetchFile={fetchFile}
            setModal={setModal}
            category="Documents et accessoires"
            mode="view"
            min={10}
            max={12}
          />
        </div>
      </div>
    </main>
  );
}
