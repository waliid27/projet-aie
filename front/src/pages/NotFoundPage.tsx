type NotFoundPageProps = {
  onNavigate: (path: string) => void;
};

export function NotFoundPage({ onNavigate }: NotFoundPageProps) {
  return (
    <main className="section">
      <div className="container container--narrow">
        <div className="panel">
          <h1>Page introuvable</h1>
          <p>Le chemin demande n'existe pas dans ce frontend simple.</p>
          <button className="button button--primary" onClick={() => onNavigate("/")}>
            Retour a l'accueil
          </button>
        </div>
      </div>
    </main>
  );
}
