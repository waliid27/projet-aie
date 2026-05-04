import type { CatalogDocument } from "../types";
import { formatDate, formatPrice } from "../utils";

type DocumentCardProps = {
  document: CatalogDocument;
  onNavigate: (path: string) => void;
};

export function DocumentCard({ document, onNavigate }: DocumentCardProps) {
  return (
    <article className="document-card">
      <button
        className="document-card__cover"
        onClick={() => onNavigate(`/document/${document.id}`)}
      >
        <span className="document-card__category">{document.category}</span>
        <span className="document-card__title">{document.title}</span>
      </button>

      <div className="document-card__body">
        <p className="document-card__meta">{document.author}</p>
        <p className="document-card__description">{document.description}</p>
        <div className="document-card__footer">
          <span>{document.type === "free" ? "Gratuit" : formatPrice(document.price)}</span>
          <span>{document.reviews} avis</span>
          <span>{formatDate(document.createdAt)}</span>
        </div>
      </div>
    </article>
  );
}
