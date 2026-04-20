export type RouteId = "home" | "library" | "case" | "reflection";

export type AppRoute = {
  id: RouteId;
  path: string;
  label: string;
};

export const routes: AppRoute[] = [
  {
    id: "home",
    path: "/",
    label: "Home",
  },
  {
    id: "library",
    path: "/cases",
    label: "Case Library",
  },
  {
    id: "case",
    path: "/case-player",
    label: "Case Player",
  },
  {
    id: "reflection",
    path: "/reflection",
    label: "Reflection",
  },
];
