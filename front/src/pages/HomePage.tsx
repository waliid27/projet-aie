import { useEffect, useState } from "react";
import { getDocuments } from "../api";
import { DocumentCard } from "../components/DocumentCard";
import { mapDocumentToCatalog } from "../types";
import type { CatalogDocument } from "../types";
import heroImage from "../assets/hero-library.jpg";

type HomePageProps = {
  onNavigate: (path: string) => void;
};

export function HomePage({ onNavigate }: HomePageProps) {
  const [documents, setDocuments] = useState<CatalogDocument[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const data = await getDocuments({ limit: 4 });
        if (!isMounted) return;

        setDocuments(data.documents.map(mapDocumentToCatalog));
        setTotal(data.total);
      } catch (_error) {
        if (!isMounted) return;
        setDocuments([]);
      }
    };

    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main>
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__content">
            <span className="hero__badge">Bibliotheque numerique</span>
            <h1>
              Le monde,
              <br />
              <em>page apres page.</em>
            </h1>
            <p>
              Decouvrez des documents publies par une communaute d'auteurs
              independants. Lisez, ecoutez, partagez.
            </p>
            <div className="hero__actions">
              <button className="button button--primary" onClick={() => onNavigate("/explore")}>
                Explorer le catalogue
              </button>
              <button className="button button--secondary" onClick={() => onNavigate("/publish")}>
                Publier un document
              </button>
            </div>
            <div className="hero__stats">
              <div>
                <strong>{total}</strong>
                <span>Documents</span>
              </div>
              <div>
                <strong>PDF</strong>
                <span>Lecture en ligne</span>
              </div>
              <div>
                <strong>Avis</strong>
                <span>Communaute active</span>
              </div>
            </div>
          </div>

          <div className="hero__media">
            <div className="hero__image-card">
              <img src={heroImage} alt="Bibliotheque editoriale" className="hero__image" />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__header">
            <div>
              <span className="eyebrow">A l'affiche</span>
              <h2>Documents recents</h2>
            </div>
            <button className="button button--ghost" onClick={() => onNavigate("/explore")}>
              Voir tout
            </button>
          </div>

          <div className="card-grid">
            {documents.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
