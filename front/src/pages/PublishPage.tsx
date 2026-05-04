import { useEffect, useRef, useState } from "react";
import { createDocument, getCategories } from "../api";
import type { ApiCategory } from "../types";

type PublishPageProps = {
  isAuthenticated: boolean;
  onNavigate: (path: string) => void;
};

export function PublishPage({ isAuthenticated, onNavigate }: PublishPageProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [type, setType] = useState<"free" | "paid">("free");
  const [price, setPrice] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!pdfFile) {
      setError("Choisissez un fichier PDF.");
      return;
    }

    try {
      setLoading(true);
      const document = await createDocument({
        title,
        description,
        categoryId: categoryId ? Number(categoryId) : undefined,
        isFree: type === "free",
        price: type === "free" ? 0 : Number(price),
        pdf: pdfFile,
      });

      onNavigate(`/document/${document.id}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Publication impossible.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="section">
        <div className="container container--narrow">
          <div className="panel">
            <h1>Connectez-vous pour publier</h1>
            <p>Cette page poste un PDF vers /api/documents.</p>
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
      <div className="container container--narrow">
        <div className="section__header section__header--stacked">
          <div>
            <span className="eyebrow">Espace auteur</span>
            <h1>Publier un document</h1>
          </div>
          <p>Formulaire simple branche sur le backend precedent.</p>
        </div>

        <form className="panel form" onSubmit={handleSubmit}>
          <div className="upload-box">
            <p>Fichier PDF</p>
            <button className="button button--secondary" type="button" onClick={() => inputRef.current?.click()}>
              Choisir un fichier
            </button>
            <input
              ref={inputRef}
              className="sr-only"
              type="file"
              accept="application/pdf"
              onChange={(event) => setPdfFile(event.target.files?.[0] || null)}
            />
            <span>{pdfFile ? pdfFile.name : "Aucun fichier selectionne"}</span>
          </div>

          <label className="field">
            <span>Titre</span>
            <input className="input" value={title} onChange={(event) => setTitle(event.target.value)} required />
          </label>

          <label className="field">
            <span>Description</span>
            <textarea
              className="textarea"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
              required
            />
          </label>

          <label className="field">
            <span>Categorie</span>
            <select className="input" value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
              <option value="">Sans categorie</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <div className="toggle-row">
            <button
              className={type === "free" ? "chip chip--active" : "chip"}
              type="button"
              onClick={() => setType("free")}
            >
              Gratuit
            </button>
            <button
              className={type === "paid" ? "chip chip--active" : "chip"}
              type="button"
              onClick={() => setType("paid")}
            >
              Payant
            </button>
          </div>

          {type === "paid" ? (
            <label className="field">
              <span>Prix</span>
              <input
                className="input"
                type="number"
                min="0.5"
                step="0.5"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                required
              />
            </label>
          ) : null}

          {error ? <p className="state state--error">{error}</p> : null}

          <button className="button button--primary" disabled={loading} type="submit">
            {loading ? "Publication..." : "Publier"}
          </button>
        </form>
      </div>
    </main>
  );
}
