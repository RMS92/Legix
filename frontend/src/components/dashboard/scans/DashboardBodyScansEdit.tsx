import { useDashboardContext } from "../../../contexts/DashboardContext";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { formatTitle } from "../../../utils/functions";
import Icon from "../../../ui/Icon";
import { ScanFile } from "../../../types";
import { FileCard } from "../../../ui/Cards";

export default function DashboardBodyScansEdit() {
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
          {formatTitle(selectedScan.title)} - Editer
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
