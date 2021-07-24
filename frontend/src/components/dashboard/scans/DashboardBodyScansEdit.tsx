import { useDashboardContext } from "../../../contexts/DashboardContext";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { formatTitle } from "../../../utils/functions";
import Icon from "../../../ui/Icon";
import { ScanFile } from "../../../types";
import { FileCard } from "../../../ui/Cards";
import ScanInfo from "../../../ui/ScanInfo";

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

  const files = (selectedScan.scanFiles || []).sort(
    (a: ScanFile, b: ScanFile) => a.position - b.position
  );

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
      await updateScan(selectedScan, "update", fields);
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
          <ScanInfo
            files={files}
            selectedScan={selectedScan}
            fetchFile={fetchFile}
            setModal={setModal}
            category="La paire"
            mode="edit"
            min={0}
            max={6}
          />
          <ScanInfo
            files={files}
            selectedScan={selectedScan}
            fetchFile={fetchFile}
            setModal={setModal}
            category="La boite"
            mode="edit"
            min={7}
            max={9}
          />
          <ScanInfo
            files={files}
            selectedScan={selectedScan}
            fetchFile={fetchFile}
            setModal={setModal}
            category="Documents et accessoires"
            mode="edit"
            min={10}
            max={12}
          />
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
