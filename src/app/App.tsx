import { AppShell } from "../components/layout/AppShell";
import { CaseLibraryPage } from "../pages/CaseLibraryPage";
import { CasePlayerPage } from "../pages/CasePlayerPage";
import { HomePage } from "../pages/HomePage";
import { ReflectionPage } from "../pages/ReflectionPage";
import { useHashRoute } from "./useHashRoute";

export const App = () => {
  const route = useHashRoute();

  return (
    <AppShell activeRoute={route.id}>
      {route.id === "home" && <HomePage />}
      {route.id === "library" && <CaseLibraryPage />}
      {route.id === "case" && <CasePlayerPage />}
      {route.id === "reflection" && <ReflectionPage />}
    </AppShell>
  );
};
