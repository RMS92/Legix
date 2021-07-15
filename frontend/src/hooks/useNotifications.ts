import { useCallback, useMemo, useReducer } from "react";
import { NotificationType } from "../types";
import { apiFetch } from "../utils/api";

export const FETCH_NOTIFICATIONS_REQUEST = "FETCH_NOTIFICATIONS_REQUEST";
export const FETCH_NOTIFICATIONS_RESPONSE = "FETCH_NOTIFICATIONS_RESPONSE";
export const FETCH_NOTIFICATION_REQUEST = "FETCH_NOTIFICATION_REQUEST";
export const FETCH_NOTIFICATION_RESPONSE = "FETCH_NOTIFICATION_RESPONSE";
export const ADD_NOTIFICATION = "CREATE_NOTIFICATION";
export const UPDATE_NOTIFICATION = "UPDATE_NOTIFICATION";
export const DELETE_NOTIFICATION = "DELETE_NOTIFICATION";
export const SELECT_NOTIFICATION = "SELECT_NOTIFICATION";
export const DESELECT_NOTIFICATION = "DESELECT_NOTIFICATION";

function reducer(state: any, action: any) {
  console.log("NOTIFICATIONS REDUCE", action.type, action);
  switch (action.type) {
    case FETCH_NOTIFICATIONS_REQUEST:
      return { ...state, loading: true };
    case FETCH_NOTIFICATIONS_RESPONSE:
      return { ...state, loading: false, notifications: action.payload };
    case FETCH_NOTIFICATION_REQUEST:
      return {
        ...state,
        selectedNotificationId: action._id,
        notifications: state.notifications.map((n: NotificationType) =>
          n._id === action._id ? { ...n, loading: true } : n
        ),
      };
    case FETCH_NOTIFICATION_RESPONSE:
      return {
        ...state,
        selectedNotificationId: action._id,
        notifications: state.notifications.map((n: NotificationType) =>
          n._id === action._id ? action.payload : n
        ),
      };
    case ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case UPDATE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.map((n: NotificationType) =>
          n === action.target ? { ...n, ...action.payload } : n
        ),
      };
    case DELETE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          (n: NotificationType) => n !== action.payload
        ),
      };
    case SELECT_NOTIFICATION:
      return { ...state, selectedNotificationId: action.payload };
    case DESELECT_NOTIFICATION:
      return { ...state, selectedNotificationId: null };
  }
}

export function useNotifications() {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    error: null,
    notifications: null,
    selectedNotificationId: null,
  });

  const notification = useMemo(() => {
    if (!Array.isArray(state.notifications)) {
      return null;
    }
    for (let n of state.notifications) {
      if (n._id === state.selectedNotificationId) {
        return n;
      }
    }
  }, [state.notifications, state.selectedNotificationId]);

  return {
    loading: state.loading,
    notifications: state.notifications,
    selectedNotification: notification,
    fetchNotifications: useCallback(
      async (routeOptions: string = "") => {
        if (state.notifications !== null) {
          return null;
        }
        dispatch({ type: FETCH_NOTIFICATIONS_REQUEST });
        const data = await apiFetch("/notifications" + routeOptions);
        dispatch({ type: FETCH_NOTIFICATIONS_RESPONSE, payload: data });
      },
      [state.notifications]
    ),
    fetchNotification: useCallback(
      async (notification: NotificationType, type: string) => {
        if (type === "select") {
          dispatch({ type: SELECT_NOTIFICATION, payload: notification._id });
        }
      },
      []
    ),
    createNotification: useCallback(async (data) => {
      const notification = await apiFetch("/notifications", {
        method: "post",
        body: JSON.stringify(data),
        dataType: "json",
      });
      dispatch({ type: ADD_NOTIFICATION, payload: notification });
    }, []),
    updateNotification: useCallback(async (notification, data) => {
      dispatch({
        type: UPDATE_NOTIFICATION,
        target: notification,
        payload: data,
      });
      await apiFetch("/notifications/" + notification._id, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    }, []),
    deleteNotification: useCallback(async () => {}, []),
    unselectNotification: useCallback(
      () => dispatch({ type: DESELECT_NOTIFICATION }),
      []
    ),
  };
}
