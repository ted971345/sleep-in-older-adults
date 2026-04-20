import { useEffect, useMemo, useState } from "react";
import { routes, type AppRoute } from "./routes";

const normalizeHash = (hash: string) => {
  const withoutHash = hash.replace(/^#/, "");
  const path = withoutHash.split("?")[0];
  return path === "" ? "/" : path;
};

export const getRouteByPath = (path: string): AppRoute =>
  routes.find((route) => route.path === path) ?? routes[0];

export const useHashRoute = () => {
  const [path, setPath] = useState(() => normalizeHash(window.location.hash));

  useEffect(() => {
    const handleHashChange = () => {
      setPath(normalizeHash(window.location.hash));
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return useMemo(() => getRouteByPath(path), [path]);
};
