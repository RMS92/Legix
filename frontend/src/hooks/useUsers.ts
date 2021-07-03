import { useReducer } from "react";
import { apiFetch } from "../utils/api";
import { User } from "../types";

export const FETCH_USERS_REQUEST = "FETCH_USERS_REQUEST";
export const FETCH_USERS_RESPONSE = "FETCH_USERS_RESPONSE";
export const DELETE_USER = "DELETE_USER";

function reducer(state: any, action: any) {
  console.log("USERS REDUCE", action.type, action);
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return { ...state, loading: true };
    case FETCH_USERS_RESPONSE:
      return { ...state, loading: false, users: action.payload };
    case DELETE_USER:
      return {
        ...state,
        users: state.users.filter((u: User) => u !== action.payload),
      };
  }
}

export function useUsers() {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    users: null,
  });

  return {
    loading: state.loading,
    users: state.users,
    fetchUsers: async () => {
      if (state.users !== null) {
        return null;
      }
      dispatch({ type: FETCH_USERS_REQUEST });
      const data = await apiFetch("/users");
      dispatch({ type: FETCH_USERS_RESPONSE, payload: data });
    },
    deleteUser: async (user: User) => {
      dispatch({ type: DELETE_USER, payload: user });
      await apiFetch("/users/" + user._id, {
        method: "delete",
      });
    },
  };
}
