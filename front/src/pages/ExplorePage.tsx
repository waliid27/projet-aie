import { useEffect, useState } from "react";
import { getCategories, getDocuments } from "../api";
import { DocumentCard } from "../components/DocumentCard";
import { mapDocumentToCatalog } from "../types";
import type { ApiCategory, CatalogDocument } from "../types";

type ExplorePageProps = {
  onNavigate: (path: string) => void;
};

export function ExplorePage({ onNavigate }: ExplorePageProps) {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [documents, setDocuments] = useState<CatalogDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const data = await getCategories();
        if (isMounted) {
          setCategories(data);
        }
      } catch (_error) {
        if (isMounted) {
          setCategories([]);
        }
      }
    };

    void loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const timeout = window.setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDocuments({
          limit: 24,
          search: query.trim() || undefined,
          categoryId: categoryId || undefined,
        });

        if (!isMounted) return;
        setDocuments(data.documents.map(mapDocumentToCatalog));
      } catch (loadError) {
        if (!isMounted) return;
        setDocuments([]);
        setError(loadError instanceof Error ? loadError.message : "Chargement impossible.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      isMounted = false;
      window.clearTimeout(timeout);
    };
  }, [query, categoryId]);

  return (
    <main className="section">
      <div className="container">
        <div className="section__header section__header--stacked">
          <div>
            <span className="eyebrow">Catalogue</span>
            <h1>Explorer</h1>
          </div>
          <p>Recherche simple par titre ou description, avec categories backend.</p>
        </div>

        <div className="filters">
          <input
            className="input"
            placeholder="Rechercher un titre ou une description"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <div className="chips">
            <button
              className={categoryId === 0 ? "chip chip--active" : "chip"}
              onClick={() => setCategoryId(0)}
            >
              Tous
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className={categoryId === category.id ? "chip chip--active" : "chip"}
                onClick={() => setCategoryId(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? <p className="state">Chargement...</p> : null}
        {error ? <p className="state state--error">{error}</p> : null}
        {!loading && !error && documents.length === 0 ? (
          <p className="state">Aucun document trouve.</p>
        ) : null}

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
    </main>
  );
}
