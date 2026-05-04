import { useEffect, useState } from "react";
import { getDocumentDownloadUrl, getDocumentViewUrl, getMyDocuments, getMyPurchases } from "../api";
import { mapDocumentToCatalog } from "../types";
import type { CatalogDocument } from "../types";
import { formatDate, formatFileSize, formatPrice } from "../utils";

type LibraryPageProps = {
  isAuthenticated: boolean;
  onNavigate: (path: string) => void;
};

export function LibraryPage({ isAuthenticated, onNavigate }: LibraryPageProps) {
  const [purchases, setPurchases] = useState<CatalogDocument[]>([]);
  const [ownedDocuments, setOwnedDocuments] = useState<CatalogDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      setPurchases([]);
      setOwnedDocuments([]);
      return;
    }

    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const [purchaseData, ownedData] = await Promise.all([getMyPurchases(), getMyDocuments()]);
        if (!isMounted) return;

        setPurchases(purchaseData.map((item) => mapDocumentToCatalog(item.document)));
        setOwnedDocuments(ownedData.map(mapDocumentToCatalog));
      } catch (loadError) {
        if (!isMounted) return;
        setError(loadError instanceof Error ? loadError.message : "Chargement impossible.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <main className="section">
        <div className="container container--narrow">
          <div className="panel">
            <h1>Connectez-vous pour voir votre bibliotheque</h1>
            <p>Cette page lit /api/purchases/me et /api/documents/mine.</p>
            <button className="button button--primary" onClick={() => onNavigate("/auth")}>
              Aller a la connexion
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container">
        <div className="section__header section__header--stacked">
          <div>
            <span className="eyebrow">Espace utilisateur</span>
            <h1>Ma bibliotheque</h1>
          </div>
        </div>

        {loading ? <p className="state">Chargement...</p> : null}
        {error ? <p className="state state--error">{error}</p> : null}

        <LibraryBlock
          title="Mes achats"
          documents={purchases}
          emptyText="Aucun achat pour le moment."
          onNavigate={onNavigate}
        />

        <LibraryBlock
          title="Mes publications"
          documents={ownedDocuments}
          emptyText="Aucune publication pour le moment."
          onNavigate={onNavigate}
        />
      </div>
    </main>
  );
}

function LibraryBlock({
  title,
  documents,
  emptyText,
  onNavigate,
}: {
  title: string;
  documents: CatalogDocument[];
  emptyText: string;
  onNavigate: (path: string) => void;
}) {
  return (
    <section className="library-block">
      <div className="section__header">
        <h2>{title}</h2>
        <span>{documents.length} document(s)</span>
      </div>

      {documents.length === 0 ? <p className="state">{emptyText}</p> : null}

      <div className="library-list">
        {documents.map((document) => (
          <article className="library-item" key={`${title}-${document.id}`}>
            <button
              className="library-item__cover"
              onClick={() => onNavigate(`/document/${document.id}`)}
            >
              <span>{document.category}</span>
              <strong>{document.title}</strong>
            </button>

            <div className="library-item__content">
              <h3>{document.title}</h3>
              <p>{document.author}</p>
              <div className="library-item__meta">
                <span>{document.type === "free" ? "Gratuit" : formatPrice(document.price)}</span>
                <span>{formatFileSize(document.size)}</span>
                <span>{formatDate(document.createdAt)}</span>
              </div>
            </div>

            <div className="library-item__actions">
              <button className="button button--ghost" onClick={() => onNavigate(`/document/${document.id}`)}>
                Details
              </button>
              <a className="button button--secondary" href={getDocumentViewUrl(document.id)} target="_blank" rel="noreferrer">
                Lire
              </a>
              <a className="button button--primary" href={getDocumentDownloadUrl(document.id)} target="_blank" rel="noreferrer">
                PDF
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
