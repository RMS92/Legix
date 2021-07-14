import { useDashboardContext } from "../../../contexts/DashboardContext";
import Icon from "../../../ui/Icon";
import { formatTitle } from "../../../utils/functions";
import { ScanStatus } from "../../../ui/Utils";
import { ScanFile } from "../../../types";
import { FileCard } from "../../../ui/Cards";
import React from "react";

export default function DashboardBodyScansView() {
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
