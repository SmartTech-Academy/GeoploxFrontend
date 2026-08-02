import { useSyncExternalStore } from "react";

const TOKEN_KEY = "token";
const TOKEN_CHANGE_EVENT = "auth-token-changed";

/**
 * The app has no global auth store - every "am I logged in" check independently reads
 * localStorage("token") inline. That's fine for the FIRST render of a component, but nothing
 * notifies already-mounted components (header/nav) when the token changes programmatically
 * without a page navigation or reload (e.g. logging in through an in-place modal) - they keep
 * rendering with whatever `enabled`/logged-in value they last computed. This module is the
 * single source of truth for reading/writing the token so every write can announce itself via
 * a custom event, and useAuthToken() lets components subscribe to that instead of reading once.
 */

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const setStoredToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event(TOKEN_CHANGE_EVENT));
};

export const clearStoredToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event(TOKEN_CHANGE_EVENT));
};

const subscribe = (callback: () => void) => {
  window.addEventListener(TOKEN_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback); // cross-tab login/logout
  return () => {
    window.removeEventListener(TOKEN_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
};

/** Reactive read of the auth token - re-renders the calling component whenever it changes. */
export const useAuthToken = () => useSyncExternalStore(subscribe, getStoredToken, getStoredToken);
