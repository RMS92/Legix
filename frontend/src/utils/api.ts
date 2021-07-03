import { API_URL } from "../config";

/**
 * @param {string} endpoint
 * @param {object} options
 */
export async function apiFetch(endpoint: string, options?: object) {
  const response = await fetch(API_URL + endpoint, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    ...options,
  });
  if (response.status === 204) {
    return null;
  }
  const responseData = await response.json();
  if (response.ok) {
    return responseData;
  } else {
    if (Array.isArray(responseData.errors)) {
      throw responseData.errors.reduce(function (acc: any, error: any) {
        acc[error.field] = error.message;
        return acc;
      }, {});
    }
    throw responseData;
  }
}

/**
 * @param {HTMLFormElement} element
 * @return {string}
 */
export function formToJson(element: HTMLFormElement): string {
  return JSON.stringify(formToObject(element));
}

/**
 * @param {HTMLFormElement} element
 * @return {object}
 */
export function formToObject(element: HTMLFormElement): object {
  return Object.fromEntries(new FormData(element));
}
