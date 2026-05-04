import type { AppRoute } from "./types";

export const documentPath = (id: number) => `/document/${id}`;

export const parseRoute = (pathname: string): AppRoute => {
  const cleanPath = pathname.replace(/\/+$/, "") || "/";

  if (cleanPath === "/") return { name: "home" };
  if (cleanPath === "/explore") return { name: "explore" };
  if (cleanPath === "/library") return { name: "library" };
  if (cleanPath === "/publish") return { name: "publish" };
  if (cleanPath === "/auth") return { name: "auth" };
  if (cleanPath === "/admin") return { name: "admin" };

  const documentMatch = cleanPath.match(/^\/document\/(\d+)$/);
  if (documentMatch) {
    return { name: "document", id: Number(documentMatch[1]) };
  }

  return { name: "not-found" };
};

export const navigateTo = (path: string) => {
  if (window.location.pathname !== path) {
    window.history.pushState({}, "", path);
  }

  window.dispatchEvent(new PopStateEvent("popstate"));
};
