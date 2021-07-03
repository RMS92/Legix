import React, { createContext, useContext, useEffect, useState } from "react";
import { Scan } from "../types";
import { useFiles } from "../hooks/useFiles";
import { ScanFile } from "../types";
import { User } from "../types";

interface scanContextInterface {
  user: User;
  page: string;
  setPage: Function;
  modal: string;
  setModal: Function;

  scan: Scan;
  setScan: Function;

  selectedFile: ScanFile;
  fetchFile: Function;
  unselectFile: Function;
}

const ScanContext = createContext<scanContextInterface>({
  // @ts-ignore
  user: {},
  page: "",
  setPage: Function,
  modal: "",
  setModal: Function,

  // @ts-ignore
  scan: {},
  setScan: Function,

  // @ts-ignore
  selectedFile: {},
  fetchFile: Promise.resolve,
  unselectFile: Promise.resolve,
});

export function useScanContext() {
  return useContext(ScanContext);
}

export function ScanContextProvider({
  user,
  children,
}: {
  user: User;
  children: JSX.Element;
}) {
  const { files, fetchFiles, fetchFile, selectedFile, unselectFile } =
    useFiles();

  const [page, setPage] = useState("scan");
  const [modal, setModal] = useState("");
  // @ts-ignore
  const [scan, setScan] = useState<Scan>(null);

  useEffect(() => {
    (async () => {
      if (!scan) {
        return;
      }
      await fetchFiles(scan.scanFiles);
    })();
  }, [scan]);

  return (
    <ScanContext.Provider
      value={{
        user,
        page,
        setPage,
        modal,
        setModal,

        scan,
        setScan,

        selectedFile,
        fetchFile,
        unselectFile,
      }}
    >
      {children}
    </ScanContext.Provider>
  );
}
