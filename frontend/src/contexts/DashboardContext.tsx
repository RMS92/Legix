import React, { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { User } from "../types";
import { useUsers } from "../hooks/useUsers";
import { useScans } from "../hooks/useScans";
import { Scan } from "../types";
import { useFiles } from "../hooks/useFiles";
import { ScanFile } from "../types";

interface DashboardContextInterface {
  page: string;
  setPage: Function;
  modal: string;
  setModal: Function;

  users: User[];
  deleteUser: Function;

  scans: Scan[];
  selectedScan: Scan;
  fetchScan: Function;
  updateScan: Function;
  deleteScan: Function;
  unselectScan: Function;

  selectedFile: ScanFile;
  fetchFile: Function;
  updateFile: Function;
  unselectFile: Function;
}

const DashboardContext = createContext<DashboardContextInterface>({
  page: "users",
  setPage: Function,
  modal: "",
  setModal: Function,

  users: [],
  deleteUser: () => Promise.resolve(),

  scans: [],
  // @ts-ignore
  selectedScan: {},
  fetchScan: () => Promise.resolve(),
  updateScan: () => Promise.resolve(),
  deleteScan: () => Promise.resolve(),
  unselectScan: () => Promise.resolve(),

  // @ts-ignore
  selectedFile: {},
  fetchFile: () => Promise.resolve(),
  updateFile: () => Promise.resolve(),
  unselectFile: () => Promise.resolve(),
});

export function useDashboardContext() {
  return useContext(DashboardContext);
}

export function DashboardContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const { users, fetchUsers, deleteUser } = useUsers();
  const {
    scans,
    selectedScan,
    fetchScans,
    fetchScan,
    updateScan,
    deleteScan,
    unselectScan,
  } = useScans();
  const { selectedFile, fetchFiles, fetchFile, updateFile, unselectFile } =
    useFiles();

  const [page, setPage] = useState("scans");
  const [modal, setModal] = useState("");

  useEffect(() => {
    (async () => {
      await fetchUsers();
      await fetchScans();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!selectedScan) {
        return;
      }
      await fetchFiles(selectedScan.scanFiles);
    })();
  }, [selectedScan]);

  useEffect(() => {
    if (modal === "") {
      unselectFile();
    }
  }, [modal]);

  return (
    <DashboardContext.Provider
      value={{
        page,
        setPage,
        modal,
        setModal,

        users,
        deleteUser,

        scans,
        selectedScan,
        fetchScan,
        updateScan,
        deleteScan,
        unselectScan,

        selectedFile,
        fetchFile,
        updateFile,
        unselectFile,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
