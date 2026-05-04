import { useEffect, useRef, useState } from "react";
import {
  buyDocument,
  createDocumentComment,
  getDocument,
  getDocumentComments,
  getDocumentDownloadUrl,
  getDocumentViewUrl,
} from "../api";
import type { ApiComment, ApiDocument, CatalogDocument } from "../types";
import { mapDocumentToCatalog } from "../types";
import { formatDate, formatFileSize, formatPrice } from "../utils";

type DocumentPageProps = {
  documentId: number;
  isAuthenticated: boolean;
  onNavigate: (path: string) => void;
};

export function DocumentPage({
  documentId,
  isAuthenticated,
  onNavigate,
}: DocumentPageProps) {
  const [document, setDocument] = useState<ApiDocument | null>(null);
  const [catalogDocument, setCatalogDocument] = useState<CatalogDocument | null>(null);
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [buying, setBuying] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [language, setLanguage] = useState("fr-FR");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const [documentData, commentData] = await Promise.all([
          getDocument(documentId),
          getDocumentComments(documentId),
        ]);

        if (!isMounted) return;
        setDocument(documentData);
        setCatalogDocument(mapDocumentToCatalog(documentData));
        setComments(commentData);
      } catch (loadError) {
        if (!isMounted) return;
        setError(loadError instanceof Error ? loadError.message : "Document introuvable.");
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
  }, [documentId, isAuthenticated]);

  const refreshDocument = async () => {
    const documentData = await getDocument(documentId);
    setDocument(documentData);
    setCatalogDocument(mapDocumentToCatalog(documentData));
  };

  const handleBuy = async () => {
    try {
      setBuying(true);
      await buyDocument(documentId);
      await refreshDocument();
    } catch (buyError) {
      setError(buyError instanceof Error ? buyError.message : "Achat impossible.");
    } finally {
      setBuying(false);
    }
  };

  const handleComment = async () => {
    if (!comment.trim() || rating === 0) {
      setError("Ajoutez une note et un commentaire.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const newComment = await createDocumentComment(documentId, comment.trim(), rating);
      setComments((current) => [newComment, ...current]);
      setComment("");
      setRating(0);
      await refreshDocument();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Commentaire impossible.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleListen = () => {
    if (!catalogDocument || typeof window === "undefined" || !window.speechSynthesis) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      `${catalogDocument.title}, par ${catalogDocument.author}. ${catalogDocument.description}`,
    );
    utterance.lang = language;
    utterance.onend = () => setIsPlaying(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  if (loading) {
    return <main className="section"><div className="container"><p className="state">Chargement...</p></div></main>;
  }

  if (error && !document) {
    return (
      <main className="section">
        <div className="container container--narrow">
          <div className="panel">
            <p className="state state--error">{error}</p>
            <button className="button button--primary" onClick={() => onNavigate("/explore")}>
              Retour au catalogue
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!document || !catalogDocument) return null;

  return (
    <main className="section">
      <div className="container">
        <button className="button button--ghost" onClick={() => onNavigate("/explore")}>
          Retour au catalogue
        </button>

        <section className="document-layout">
          <div className="document-cover">
            <span>{catalogDocument.category}</span>
            <h1>{catalogDocument.title}</h1>
            <p>{catalogDocument.author}</p>
          </div>

          <div className="document-details panel">
            <span className="eyebrow">{catalogDocument.category}</span>
            <h2>{catalogDocument.title}</h2>
            <p>{catalogDocument.description}</p>

            <div className="document-details__meta">
              <span>{formatFileSize(catalogDocument.size)}</span>
              <span>{formatDate(catalogDocument.createdAt)}</span>
              <span>{catalogDocument.reviews} avis</span>
              <span>{document.viewCount} lectures</span>
            </div>

            {!catalogDocument.hasAccess ? (
              <div className="action-box">
                <strong>
                  {catalogDocument.type === "free"
                    ? "Gratuit"
                    : formatPrice(catalogDocument.price)}
                </strong>
                <button className="button button--primary" disabled={buying} onClick={() => void handleBuy()}>
                  {buying ? "Achat..." : "Acheter"}
                </button>
              </div>
            ) : (
              <div className="action-box action-box--stack">
                <div className="action-row">
                  <a className="button button--primary" href={getDocumentViewUrl(document.id)} target="_blank" rel="noreferrer">
                    Lire
                  </a>
                  <a className="button button--secondary" href={getDocumentDownloadUrl(document.id)} target="_blank" rel="noreferrer">
                    Telecharger
                  </a>
                  {/* <button className="button button--ghost" onClick={handleListen}>
                    {isPlaying ? "Stop audio" : "Ecouter"}
                  </button> */}
                </div>
                <select className="input" value={language} onChange={(event) => setLanguage(event.target.value)}>
                  <option value="fr-FR">Francais</option>
                  <option value="en-US">English</option>
                  <option value="ar-SA">Arabe</option>
                  <option value="es-ES">Espagnol</option>
                </select>
              </div>
            )}
          </div>
        </section>

        <section className="comments-layout">
          <div className="panel">
            <h3>Avis des lecteurs</h3>
            {comments.length === 0 ? <p className="state">Aucun avis pour le moment.</p> : null}
            <div className="comment-list">
              {comments.map((item) => (
                <article className="comment-card" key={item.id}>
                  <div className="comment-card__header">
                    <strong>{item.user.fullName}</strong>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                  <p>Note: {item.rating}/5</p>
                  <p>{item.content}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="panel">
            <h3>Laisser un avis</h3>
            {!isAuthenticated ? <p className="state">Connectez-vous pour commenter.</p> : null}
            {isAuthenticated && !catalogDocument.hasAccess ? (
              <p className="state">Vous devez avoir acces au document pour commenter.</p>
            ) : null}

            {isAuthenticated && catalogDocument.hasAccess ? (
              <div className="form">
                <label className="field">
                  <span>Note</span>
                  <select className="input" value={rating} onChange={(event) => setRating(Number(event.target.value))}>
                    <option value={0}>Choisir</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </select>
                </label>

                <label className="field">
                  <span>Commentaire</span>
                  <textarea
                    className="textarea"
                    rows={5}
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                  />
                </label>

                {error ? <p className="state state--error">{error}</p> : null}

                <button className="button button--primary" disabled={submitting} onClick={() => void handleComment()}>
                  {submitting ? "Publication..." : "Publier l'avis"}
                </button>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
