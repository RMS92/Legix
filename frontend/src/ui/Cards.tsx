import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import { formatDescription, formatTitle } from "../utils/functions";
import { ScanBadgeStatus } from "./Utils";
import { ScanFile } from "../types";
import { Scan } from "../types";

export function ScanCard({ scan }: { scan: Scan }) {
  const filename = scan.scanFiles[0].current_filename;
  return (
    <div className="card">
      <div className="card__body stack">
        <div className="card__icons">
          <a href="#" className="user__icon">
            <img
              src={
                process.env.PUBLIC_URL +
                `/media/uploads/scans/${scan.user.username}/${filename}`
              }
              alt={filename}
            />
          </a>
        </div>
        <div className="card__title">
          <Link to={`/scans/${scan._id}`}>{formatTitle(scan.title)}</Link>
        </div>
        <div className="card__description mb2">
          <p>{formatDescription(scan.description)}</p>
        </div>
        <Link to={`/scans/${scan._id}`} className="card__link" />
      </div>

      <div className="card__progress" />

      <footer className="card__footer">
        <div className="card_avatars avatars">
          <a className="avatar">
            {scan.user.avatarFile ? (
              <img
                src={
                  process.env.PUBLIC_URL +
                  `/media/uploads/profil/${scan.user.username}/${scan.user.avatarFile.current_filename}`
                }
                alt={`avatar-${scan.user.username}`}
              />
            ) : (
              <img src="/media/default.png" alt="avatar-default" />
            )}
          </a>
        </div>
        <div></div>
      </footer>

      <div className="card__badge">
        <ScanBadgeStatus status={scan.status} />
      </div>
    </div>
  );
}

export function FileCard({
  scan,
  file,
  fetchFile,
  modalName,
  setModal,
}: {
  scan: Scan;
  file: ScanFile;
  fetchFile: Function;
  modalName: string;
  setModal: Function;
}) {
  const handleClick = async (scanFile: ScanFile) => {
    await fetchFile(scanFile, "select");
    setModal(modalName);
  };

  return (
    <div className="card-file">
      <div className="card-file__badge">
        <Icon
          name="badge"
          width="20"
          style={{
            color:
              file.status === 0
                ? "#FF5C5C"
                : file.status === 2
                ? "#39D98A"
                : file.status === 3
                ? "#FDAC42"
                : "#FCFCFC",
          }}
        />
      </div>
      <img
        key={file._id}
        onClick={() => handleClick(file as ScanFile)}
        style={{ cursor: "pointer" }}
        src={
          process.env.PUBLIC_URL +
          `/media/uploads/scans/${scan.user.username}/${file.current_filename}`
        }
        alt={file.current_filename}
      />
    </div>
  );
}

export function DownloadCard({
  type,
  isReset,
  addFile,
  updateFile,
  deleteFile,
}: {
  type: string;
  isReset: boolean;
  addFile: Function;
  updateFile: Function;
  deleteFile: Function;
}) {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (!isReset) {
      return;
    }
    setFile(null);
  }, [isReset]);

  const handleChange = (e: React.SyntheticEvent) => {
    e.preventDefault();

    // Update file hook
    if (file && inputRef.current?.files) {
      const updatedFile = inputRef.current?.files[0];
      Object.assign(updatedFile, { orientation: type });
      setFile(updatedFile);
      updateFile(updatedFile, file);
      return;
    }

    // Add file hook
    if (inputRef.current?.files) {
      const newFile = inputRef.current?.files[0];
      Object.assign(newFile, { orientation: type });
      setFile(newFile);
      addFile(newFile);
      return;
    }
  };

  const handleDelete = async () => {
    deleteFile(file);
    setFile(null);
  };

  return (
    <div className="card-download">
      <div className="card-download__delete">
        {file ? (
          <Icon name="delete" width="18" height="18" onClick={handleDelete} />
        ) : null}
      </div>
      <div className="card-download__body">
        <div className="card-download__actions">
          <input
            name="files"
            type="file"
            // @ts-ignore
            ref={inputRef}
            onChange={handleChange}
          />
          <button
            className="btn-download"
            type="button"
            onClick={() => inputRef.current?.click()}
          >
            {file ? (
              <Icon name="edit" width="20" height="20" />
            ) : (
              <Icon name="plus" width="22" height="22" />
            )}
          </button>
        </div>
        <div className="card-download__infos">
          {file ? (
            <>
              <Icon name="download" width="20" />
              {file.name}
            </>
          ) : (
            <>
              <Icon name="360" width="20" />
              {type}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
