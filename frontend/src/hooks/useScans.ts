import { useCallback, useMemo, useReducer } from "react";
import { apiFetch } from "../utils/api";
import { Scan } from "../types";

export const FETCH_SCANS_REQUEST = "FETCH_SCANS_REQUEST";
export const FETCH_SCANS_RESPONSE = "FETCH_SCANS_RESPONSE";
export const FETCH_SCAN_REQUEST = "FETCH_SCAN_REQUEST";
export const FETCH_SCAN_RESPONSE = "FETCH_SCAN_RESPONSE";
export const UPDATE_SCAN = "UPDATE_SCAN";
export const DELETE_SCAN = "DELETE_SCAN";
export const SELECT_SCAN = "SELECT_SCAN";
export const DESELECT_SCAN = "DESELECT_SCAN";

function reducer(state: any, action: any) {
  console.log("SCANS REDUCE", action.type, action);
  switch (action.type) {
    case FETCH_SCANS_REQUEST:
      return { ...state, loading: true };
    case FETCH_SCANS_RESPONSE:
      return { ...state, loading: false, scans: action.payload };
    case FETCH_SCAN_REQUEST:
      return {
        ...state,
        selectedScanId: action._id,
        scans: state.scans.map((s: Scan) =>
          s._id === action._id ? { ...s, loading: true } : s
        ),
      };
    case FETCH_SCAN_RESPONSE:
      return {
        ...state,
        selectedScanId: action._id,
        scans: state.scans.map((s: Scan) =>
          s._id === action._id ? action.payload : s
        ),
      };
    case UPDATE_SCAN:
      return {
        ...state,
        scans: state.scans.map((s: Scan) =>
          s === action.target ? { ...s, ...action.payload } : s
        ),
      };
    case DELETE_SCAN:
      return {
        ...state,
        scans: state.scans.filter((s: Scan) => s !== action.payload),
      };
    case SELECT_SCAN:
      return { ...state, selectedScanId: action.payload };
    case DESELECT_SCAN:
      return { ...state, selectedScanId: null };
  }
}

export function useScans() {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    error: null,
    scans: null,
    selectedScanId: null,
  });

  const scan = useMemo(() => {
    if (!Array.isArray(state.scans)) {
      return null;
    }
    for (let s of state.scans) {
      if (s._id === state.selectedScanId) {
        return s;
      }
    }
  }, [state.scans, state.selectedScanId]);

  return {
    loading: state.loading,
    scans: state.scans,
    selectedScan: scan,
    fetchScans: useCallback(
      async (routeOptions: string = "") => {
        if (state.scans !== null) {
          return null;
        }
        dispatch({ type: FETCH_SCANS_REQUEST });
        const data = await apiFetch("/scans" + routeOptions);
        dispatch({ type: FETCH_SCANS_RESPONSE, payload: data });
      },
      [state.scans]
    ),
    fetchScan: useCallback(async (scan: Scan, type: string) => {
      if (type === "select") {
        dispatch({ type: SELECT_SCAN, payload: scan._id });
      } else {
        dispatch({ type: FETCH_SCAN_REQUEST, _id: scan._id });
        const data = await apiFetch("/scans/" + scan._id);
        dispatch({ type: FETCH_SCAN_RESPONSE, payload: data, _id: scan._id });
      }
    }, []),
    updateScan: useCallback(async (scan: Scan, type: string, data: object) => {
      if (type === "confirm") {
        dispatch({ type: UPDATE_SCAN, target: scan, payload: data });
        await apiFetch("/scans/" + scan._id + "/confirm", {
          method: "PATCH",
          body: JSON.stringify(data),
        });
      } else {
        dispatch({ type: UPDATE_SCAN, target: scan, payload: data });
        await apiFetch("/scans/" + scan._id, {
          method: "PATCH",
          body: JSON.stringify(data),
        });
      }
    }, []),
    deleteScan: useCallback(async (scan: Scan) => {
      dispatch({ type: DELETE_SCAN, payload: scan });
      await apiFetch("/scans/" + scan._id, {
        method: "delete",
      });
    }, []),
    unselectScan: useCallback(() => dispatch({ type: DESELECT_SCAN }), []),
  };
}
