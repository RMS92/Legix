import { useCallback, useReducer } from "react";
import { apiFetch } from "../utils/api";
import { CommentType } from "../types";
import { Scan } from "../types";

export const FETCH_SCAN_COMMENTS_REQUEST = "FETCH_SCAN_COMMENTS_REQUEST";
export const FETCH_SCAN_COMMENTS_RESPONSE = "FETCH_SCAN_COMMENTS_RESPONSE";
export const ADD_COMMENT = "ADD_COMMENT";
export const UPDATE_COMMENT = "UPDATE_COMMENT";
export const DELETE_COMMENT = "DELETE_COMMENT";

function reducer(state: any, action: any) {
  console.log("COMMENTS REDUCE", action.type, action);
  switch (action.type) {
    case FETCH_SCAN_COMMENTS_REQUEST:
      return { ...state, loading: true };
    case FETCH_SCAN_COMMENTS_RESPONSE:
      return { ...state, loading: false, comments: action.payload };
    case ADD_COMMENT:
      return { ...state, comments: [...state.comments, action.payload] };
    case UPDATE_COMMENT:
      return {
        ...state,
        comments: state.comments.map((c: CommentType) =>
          c === action.target ? { ...c, ...action.payload } : c
        ),
      };
    case DELETE_COMMENT:
      return {
        ...state,
        comments: state.comments.filter(
          (c: CommentType) => c !== action.payload
        ),
      };
  }
}

export function useComments() {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    comments: null,
  });

  return {
    loading: state.loading,
    comments: state.comments,
    fetchScanComments: useCallback(
      async (scan: Scan) => {
        if (state.comments !== null) {
          return null;
        }
        dispatch({ type: FETCH_SCAN_COMMENTS_REQUEST });
        const data = await apiFetch("/comments/scans/" + scan._id);
        dispatch({ type: FETCH_SCAN_COMMENTS_RESPONSE, payload: data });
      },
      [state.comments]
    ),
    createComment: useCallback(async (data) => {
      const newComment = await apiFetch("/comments", {
        method: "post",
        body: JSON.stringify(data),
        dataType: "json",
      });
      dispatch({ type: ADD_COMMENT, payload: newComment });
      return newComment;
    }, []),
    updateComment: useCallback(async (comment, data) => {
      dispatch({ type: UPDATE_COMMENT, target: comment, payload: data });
      await apiFetch("/comments/" + comment._id, {
        method: "PATCH",
        body: JSON.stringify(data),
        dataType: "json",
      });
    }, []),
    deleteComment: useCallback(async (comment: CommentType) => {
      dispatch({ type: DELETE_COMMENT, payload: comment });
      await apiFetch("/comments/" + comment._id, {
        method: "delete",
      });
    }, []),
  };
}
