import { useEffect, useState } from "react";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "./api";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { AdminPage } from "./pages/AdminPage";
import { AuthPage } from "./pages/AuthPage";
import { DocumentPage } from "./pages/DocumentPage";
import { ExplorePage } from "./pages/ExplorePage";
import { HomePage } from "./pages/HomePage";
import { LibraryPage } from "./pages/LibraryPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PublishPage } from "./pages/PublishPage";
import { navigateTo, parseRoute } from "./router";
import type { ApiUser, AppRoute } from "./types";

export default function App() {
  const [route, setRoute] = useState<AppRoute>(() => parseRoute(window.location.pathname));
  const [user, setUser] = useState<ApiUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseRoute(window.location.pathname));
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const refresh = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
        }
      } catch (_error) {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    };

    void refresh();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleNavigate = (path: string) => {
    navigateTo(path);
  };

  const handleLogin = async (email: string, password: string) => {
    const currentUser = await loginUser(email, password);
    setUser(currentUser);
    handleNavigate("/library");
  };

  const handleRegister = async (firstName: string, lastName: string, email: string, password: string, phone?: string, dateOfBirth?: string) => {
    const currentUser = await registerUser(firstName, lastName, email, password, phone, dateOfBirth);
    setUser(currentUser);
    handleNavigate("/library");
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    handleNavigate("/");
  };

  const renderPage = () => {
    if (authLoading && (route.name === "library" || route.name === "publish" || route.name === "admin")) {
      return (
        <main className="section">
          <div className="container">
            <p className="state">Verification de session...</p>
          </div>
        </main>
      );
    }

    switch (route.name) {
      case "home":
        return <HomePage onNavigate={handleNavigate} />;
      case "explore":
        return <ExplorePage onNavigate={handleNavigate} />;
      case "library":
        return <LibraryPage isAuthenticated={Boolean(user)} onNavigate={handleNavigate} />;
      case "publish":
        return <PublishPage isAuthenticated={Boolean(user)} onNavigate={handleNavigate} />;
      case "auth":
        return <AuthPage onLogin={handleLogin} onRegister={handleRegister} />;
      case "admin":
        return <AdminPage user={user} onNavigate={handleNavigate} />;
      case "document":
        return (
          <DocumentPage
            documentId={route.id}
            isAuthenticated={Boolean(user)}
            onNavigate={handleNavigate}
          />
        );
      default:
        return <NotFoundPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="app-shell">
      <SiteHeader
        route={route}
        userName={user?.fullName}
        userRole={user?.role}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
      {renderPage()}
      <SiteFooter />
    </div>
  );
}
