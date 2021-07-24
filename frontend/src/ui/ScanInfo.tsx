import React from "react";
import { Scan, ScanFile } from "../types";
import { FileCard } from "./Cards";

export default function ScanInfo({
  files,
  selectedScan,
  fetchFile,
  setModal,
  category,
  mode,
  min,
  max,
}: {
  files: ScanFile[];
  selectedScan: Scan;
  fetchFile: Function;
  setModal: Function;
  category: string;
  mode: string;
  min: number;
  max: number;
}) {
  return (
    <section className="scan-info">
      <div className="section-title">{category}</div>
      <div className="scans">
        {files.map((f: ScanFile) =>
          f.position >= min && f.position <= max ? (
            <FileCard
              key={f._id}
              scan={selectedScan}
              file={f}
              fetchFile={fetchFile}
              modalName={`files/${mode}`}
              setModal={setModal}
            />
          ) : null
        )}
      </div>
    </section>
  );
}
