import type { AppRoute } from "../types";

type SiteHeaderProps = {
  route: AppRoute;
  userName?: string;
  userRole?: string;
  onNavigate: (path: string) => void;
  onLogout: () => Promise<void>;
};

export function SiteHeader({ route, userName, userRole, onNavigate, onLogout }: SiteHeaderProps) {
  const active = route.name;

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <button className="brand" onClick={() => onNavigate("/")}>
          <span className="brand__mark">L</span>
          <span>Lirea</span>
        </button>

        <nav className="site-nav">
          <button
            className={active === "home" ? "is-active" : ""}
            onClick={() => onNavigate("/")}
          >
            Accueil
          </button>
          <button
            className={active === "explore" ? "is-active" : ""}
            onClick={() => onNavigate("/explore")}
          >
            Explorer
          </button>
          <button
            className={active === "library" ? "is-active" : ""}
            onClick={() => onNavigate("/library")}
          >
            Bibliotheque
          </button>
          <button
            className={active === "publish" ? "is-active" : ""}
            onClick={() => onNavigate("/publish")}
          >
            Publier
          </button>
          {userRole === "admin" && (
            <button
              className={active === "admin" ? "is-active" : ""}
              onClick={() => onNavigate("/admin")}
            >
              Admin
            </button>
          )}
        </nav>

        <div className="site-header__actions">
          {userName ? (
            <>
              <button className="button button--ghost" onClick={() => onNavigate("/library")}>
                {userName.split(" ")[0]}
              </button>
              <button className="button button--secondary" onClick={() => void onLogout()}>
                Deconnexion
              </button>
            </>
          ) : (
            <button className="button button--primary" onClick={() => onNavigate("/auth")}>
              Connexion
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
