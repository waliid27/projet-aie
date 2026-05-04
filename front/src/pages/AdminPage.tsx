import { useEffect, useState } from "react";
import {
  adminCreateCategory,
  adminDeleteCategory,
  adminDeleteDocument,
  adminGetDocuments,
  adminGetUsers,
  adminSetDocumentStatus,
  adminSetUserActive,
  adminUpdateCategory,
  getCategories,
  getDocumentViewUrl,
} from "../api";
import type { ApiCategory, ApiDocument, ApiUser } from "../types";
import { formatDate, formatPrice } from "../utils";

type AdminTab = "users" | "documents" | "categories";

type AdminPageProps = {
  user: ApiUser | null;
  onNavigate: (path: string) => void;
};

export function AdminPage({ user, onNavigate }: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("users");

  if (!user || user.role !== "admin") {
    return (
      <main className="section">
        <div className="container container--narrow">
          <div className="panel">
            <h1>Acces refuse</h1>
            <p>Cette page est reservee aux administrateurs.</p>
            <button className="button button--primary" onClick={() => onNavigate("/")}>
              Retour a l'accueil
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
            <span className="eyebrow">Administration</span>
            <h1>Panneau admin</h1>
          </div>
        </div>

        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === "users" ? "is-active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Utilisateurs
          </button>
          <button
            className={`admin-tab ${activeTab === "documents" ? "is-active" : ""}`}
            onClick={() => setActiveTab("documents")}
          >
            Documents
          </button>
          <button
            className={`admin-tab ${activeTab === "categories" ? "is-active" : ""}`}
            onClick={() => setActiveTab("categories")}
          >
            Categories
          </button>
        </div>

        <div className="admin-content">
          {activeTab === "users" && <UsersTab />}
          {activeTab === "documents" && <DocumentsTab />}
          {activeTab === "categories" && <CategoriesTab />}
        </div>
      </div>
    </main>
  );
}

function UsersTab() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pending, setPending] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    adminGetUsers()
      .then((data) => { if (isMounted) setUsers(data); })
      .catch((e) => { if (isMounted) setError(e instanceof Error ? e.message : "Erreur"); })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, []);

  const toggleActive = async (user: ApiUser) => {
    setPending(user.id);
    try {
      const updated = await adminSetUserActive(user.id, !user.isActive);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur");
    } finally {
      setPending(null);
    }
  };

  if (loading) return <p className="state">Chargement...</p>;
  if (error) return <p className="state state--error">{error}</p>;

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Role</th>
            <th>Statut</th>
            <th>Inscription</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.fullName}</td>
              <td>{u.email}</td>
              <td>
                <span className={`badge ${u.role === "admin" ? "badge--admin" : "badge--user"}`}>
                  {u.role}
                </span>
              </td>
              <td>
                <span className={`badge ${u.isActive ? "badge--active" : "badge--inactive"}`}>
                  {u.isActive ? "Actif" : "Inactif"}
                </span>
              </td>
              <td>{formatDate(u.createdAt)}</td>
              <td>
                <button
                  className={`button button--sm ${u.isActive ? "button--ghost" : "button--secondary"}`}
                  onClick={() => void toggleActive(u)}
                  disabled={pending === u.id}
                >
                  {pending === u.id ? "..." : u.isActive ? "Desactiver" : "Activer"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && <p className="state">Aucun utilisateur.</p>}
    </div>
  );
}

function DocumentsTab() {
  const [documents, setDocuments] = useState<ApiDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pending, setPending] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    adminGetDocuments()
      .then((data) => { if (isMounted) setDocuments(data); })
      .catch((e) => { if (isMounted) setError(e instanceof Error ? e.message : "Erreur"); })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, []);

  const changeStatus = async (doc: ApiDocument, status: string) => {
    setPending(doc.id);
    try {
      const updated = await adminSetDocumentStatus(doc.id, status);
      setDocuments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur");
    } finally {
      setPending(null);
    }
  };

  const deleteDoc = async (doc: ApiDocument) => {
    if (!confirm(`Supprimer "${doc.title}" ?`)) return;
    setPending(doc.id);
    try {
      await adminDeleteDocument(doc.id);
      setDocuments((prev) => prev.map((d) => d.id === doc.id ? { ...d, status: "deleted" } : d));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur");
    } finally {
      setPending(null);
    }
  };

  const statusClass = (status: string) => {
    if (status === "active") return "badge--active";
    if (status === "hidden") return "badge--hidden";
    return "badge--inactive";
  };

  if (loading) return <p className="state">Chargement...</p>;
  if (error) return <p className="state state--error">{error}</p>;

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Titre</th>
            <th>Auteur</th>
            <th>Categorie</th>
            <th>Statut</th>
            <th>Prix</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.id}</td>
              <td>{doc.title}</td>
              <td>{doc.owner?.fullName ?? "—"}</td>
              <td>{doc.category?.name ?? "—"}</td>
              <td>
                <span className={`badge ${statusClass(doc.status)}`}>{doc.status}</span>
              </td>
              <td>{doc.isFree ? "Gratuit" : formatPrice(doc.price)}</td>
              <td className="admin-actions">
                <a
                  className="button button--sm button--secondary"
                  href={getDocumentViewUrl(doc.id)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ouvrir
                </a>
                <select
                  value={doc.status}
                  disabled={pending === doc.id}
                  onChange={(e) => void changeStatus(doc, e.target.value)}
                  className="admin-select"
                >
                  <option value="active">active</option>
                  <option value="hidden">hidden</option>
                  <option value="deleted">deleted</option>
                </select>
                <button
                  className="button button--sm button--danger"
                  onClick={() => void deleteDoc(doc)}
                  disabled={pending === doc.id || doc.status === "deleted"}
                >
                  {pending === doc.id ? "..." : "Supprimer"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {documents.length === 0 && <p className="state">Aucun document.</p>}
    </div>
  );
}

type EditForm = { name: string; description: string };

function CategoriesTab() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ name: "", description: "" });
  const [addForm, setAddForm] = useState<EditForm>({ name: "", description: "" });
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getCategories()
      .then((data) => { if (isMounted) setCategories(data); })
      .catch((e) => { if (isMounted) setError(e instanceof Error ? e.message : "Erreur"); })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, []);

  const startEdit = (cat: ApiCategory) => {
    setEditingId(cat.id);
    setEditForm({ name: cat.name, description: cat.description ?? "" });
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (id: number) => {
    if (!editForm.name.trim()) return alert("Le nom est obligatoire");
    setPending(true);
    try {
      const updated = await adminUpdateCategory(id, editForm.name.trim(), editForm.description.trim() || undefined);
      setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setEditingId(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur");
    } finally {
      setPending(false);
    }
  };

  const deleteCategory = async (cat: ApiCategory) => {
    if (!confirm(`Supprimer la categorie "${cat.name}" ?`)) return;
    setPending(true);
    try {
      await adminDeleteCategory(cat.id);
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur");
    } finally {
      setPending(false);
    }
  };

  const addCategory = async () => {
    if (!addForm.name.trim()) return alert("Le nom est obligatoire");
    setPending(true);
    try {
      const created = await adminCreateCategory(addForm.name.trim(), addForm.description.trim() || undefined);
      setCategories((prev) => [...prev, created]);
      setAddForm({ name: "", description: "" });
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur");
    } finally {
      setPending(false);
    }
  };

  if (loading) return <p className="state">Chargement...</p>;
  if (error) return <p className="state state--error">{error}</p>;

  return (
    <div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) =>
              editingId === cat.id ? (
                <tr key={cat.id}>
                  <td>{cat.id}</td>
                  <td>
                    <input
                      className="admin-input"
                      value={editForm.name}
                      onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                    />
                  </td>
                  <td>
                    <input
                      className="admin-input"
                      value={editForm.description}
                      onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                      placeholder="Description (optionnel)"
                    />
                  </td>
                  <td className="admin-actions">
                    <button
                      className="button button--sm button--primary"
                      onClick={() => void saveEdit(cat.id)}
                      disabled={pending}
                    >
                      Sauver
                    </button>
                    <button className="button button--sm button--ghost" onClick={cancelEdit}>
                      Annuler
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={cat.id}>
                  <td>{cat.id}</td>
                  <td>{cat.name}</td>
                  <td>{cat.description ?? "—"}</td>
                  <td className="admin-actions">
                    <button
                      className="button button--sm button--ghost"
                      onClick={() => startEdit(cat)}
                      disabled={pending}
                    >
                      Modifier
                    </button>
                    <button
                      className="button button--sm button--danger"
                      onClick={() => void deleteCategory(cat)}
                      disabled={pending}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
        {categories.length === 0 && <p className="state">Aucune categorie.</p>}
      </div>

      <div className="admin-add-form">
        <h3>Ajouter une categorie</h3>
        <div className="admin-add-form__fields">
          <input
            className="admin-input"
            placeholder="Nom *"
            value={addForm.name}
            onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
          />
          <input
            className="admin-input"
            placeholder="Description (optionnel)"
            value={addForm.description}
            onChange={(e) => setAddForm((f) => ({ ...f, description: e.target.value }))}
          />
          <button
            className="button button--primary"
            onClick={() => void addCategory()}
            disabled={pending}
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
