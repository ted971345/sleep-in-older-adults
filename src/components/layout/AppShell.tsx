import type { PropsWithChildren } from "react";
import { routes, type RouteId } from "../../app/routes";
import { Footer } from "./Footer";
import { Header } from "./Header";

type AppShellProps = PropsWithChildren<{
  activeRoute: RouteId;
}>;

export const AppShell = ({ activeRoute, children }: AppShellProps) => (
  <div className="app-shell">
    <Header activeRoute={activeRoute} routes={routes} />
    <main className="app-main" id="main-content">
      {children}
    </main>
    <Footer />
  </div>
);
