import { navigateTo } from "../router";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <button className="brand" onClick={() => navigateTo("/")}>
            <span className="brand__mark">L</span>
            <span>Lirea</span>
          </button>
          <p className="site-footer__tagline">
            Decouvrez, partagez et achetez des documents PDF de qualite.
          </p>
        </div>

        <nav className="site-footer__nav">
          <span className="site-footer__nav-title">Navigation</span>
          <button onClick={() => navigateTo("/")}>Accueil</button>
          <button onClick={() => navigateTo("/explore")}>Explorer</button>
          <button onClick={() => navigateTo("/library")}>Bibliotheque</button>
          <button onClick={() => navigateTo("/publish")}>Publier</button>
        </nav>

      </div>

      <div className="site-footer__bottom">
        <div className="container">
          <p>&copy; {year} Lirea. Tous droits reserves.</p>
        </div>
      </div>
    </footer>
  );
}
