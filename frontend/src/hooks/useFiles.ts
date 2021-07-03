import { useCallback, useMemo, useReducer } from "react";
import { apiFetch } from "../utils/api";
import { ScanFile } from "../types";

export const FETCH_FILES_REQUEST = "FETCH_FILES_REQUEST";
export const FETCH_FILES_RESPONSE = "FETCH_FILES_RESPONSE";
export const FETCH_FILE_REQUEST = "FETCH_FILE_REQUEST";
export const FETCH_FILE_RESPONSE = "FETCH_FILE_RESPONSE";
export const SELECT_FILE = "SELECT_FILE";
export const ADD_FILE = "ADD_FILE";
export const UPDATE_FILE = "UPDATE_FILE";
export const DELETE_FILE = "DELETE_FILE";
export const DESELECT_FILE = "DESELECT_FILE";
export const RESET_FILES = "RESET_FILES";

function reducer(state: any, action: any) {
  console.log("FILES REDUCE", action.type, action);
  switch (action.type) {
    case FETCH_FILES_REQUEST:
      return { ...state, loading: true };
    case FETCH_FILES_RESPONSE:
      return { ...state, loading: false, files: action.payload };
    case FETCH_FILE_REQUEST:
      return {
        ...state,
        selectedFileId: action.id,
        files: state.files.map((f: any) =>
          f._id === action._id ? { ...f, loading: true } : f
        ),
      };
    case FETCH_FILE_RESPONSE:
      return {
        ...state,
        selectedFileId: action.id,
        files: state.files.map((f: any) =>
          f._id === action._id ? action.payload : f
        ),
      };
    case SELECT_FILE:
      return { ...state, selectedFileId: action.payload };
    case ADD_FILE:
      return { ...state, files: [...state.files, action.payload] };
    case UPDATE_FILE:
      return {
        ...state,
        files: state.files.map((f: any) =>
          f === action.target ? { ...f, ...action.payload } : f
        ),
      };
    case DELETE_FILE:
      return {
        ...state,
        files: state.files.filter((f: any) => f !== action.payload),
      };
    case DESELECT_FILE:
      return { ...state, selectedFileId: null };
    case RESET_FILES:
      return {
        ...state,
        files: [],
      };
  }
}

export function useFiles() {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    files: null,
    selectedFileId: null,
  });

  const file = useMemo(() => {
    if (!Array.isArray(state.files)) {
      return null;
    }
    for (let f of state.files) {
      if (f._id === state.selectedFileId) {
        return f;
      }
    }
  }, [state.files, state.selectedFileId]);

  return {
    loading: state.loading,
    files: state.files,
    selectedFile: file,
    fetchFiles: async (files: any[]) => {
      dispatch({ type: FETCH_FILES_REQUEST });
      dispatch({ type: FETCH_FILES_RESPONSE, payload: files });
    },
    fetchFile: useCallback(async (scanFile: ScanFile, type: string) => {
      if (type === "select") {
        dispatch({ type: SELECT_FILE, payload: scanFile._id });
      } else {
        dispatch({ type: FETCH_FILE_REQUEST, _id: scanFile._id });
        const data = await apiFetch("/files/" + scanFile._id);
        dispatch({
          type: FETCH_FILE_RESPONSE,
          payload: data,
          id: scanFile._id,
        });
      }
    }, []),
    addFile: useCallback(async (file: File) => {
      dispatch({ type: ADD_FILE, payload: file });
    }, []),
    updateFile: useCallback(async (file, data) => {
      dispatch({ type: UPDATE_FILE, target: file, payload: data });
      await apiFetch("/files/" + file._id, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    }, []),
    deleteFile: useCallback(async (file: File) => {
      dispatch({ type: DELETE_FILE, payload: file });
    }, []),
    changeFile: useCallback(async (newFile: File, oldFile: File) => {
      dispatch({ type: UPDATE_FILE, target: oldFile, payload: newFile });
    }, []),
    unselectFile: useCallback(() => dispatch({ type: DESELECT_FILE }), []),
    resetFiles: useCallback(() => dispatch({ type: RESET_FILES }), []),
  };
}
