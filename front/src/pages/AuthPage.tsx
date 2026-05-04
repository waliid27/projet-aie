import { useState } from "react";

type AuthPageProps = {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phone?: string,
    dateOfBirth?: string,
  ) => Promise<void>;
};

export function AuthPage({ onLogin, onRegister }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      setLoading(true);

      if (mode === "login") {
        await onLogin(email, password);
      } else {
        await onRegister(
          firstName,
          lastName,
          email,
          password,
          phone || undefined,
          dateOfBirth || undefined,
        );
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Action impossible.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="section">
      <div className="container container--narrow">
        <div className="panel">
          <span className="eyebrow">
            {mode === "login" ? "Bon retour" : "Bienvenue"}
          </span>
          <h1>{mode === "login" ? "Connexion" : "Creer un compte"}</h1>

          <form className="form" onSubmit={handleSubmit}>
            {mode === "register" && (
              <>
                <div className="field-row">
                  <label className="field">
                    <span>Prenom *</span>
                    <input
                      className="input"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </label>
                  <label className="field">
                    <span>Nom</span>
                    <input
                      className="input"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </label>
                </div>

                <label className="field">
                  <span>Telephone</span>
                  <input
                    className="input"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+213 ..."
                  />
                </label>

                <label className="field">
                  <span>Date de naissance</span>
                  <input
                    className="input"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </label>
              </>
            )}

            <label className="field">
              <span>Email *</span>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="field">
              <span>Mot de passe *</span>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            {error ? <p className="state state--error">{error}</p> : null}

            <button
              className="button button--primary"
              disabled={loading}
              type="submit"
            >
              {loading
                ? "Patientez..."
                : mode === "login"
                  ? "Se connecter"
                  : "Creer mon compte"}
            </button>
          </form>

          <button
            className="button button--ghost button--ghost--1"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login"
              ? "Pas encore de compte ? S'inscrire"
              : "Deja inscrit ? Se connecter"}
          </button>
        </div>
      </div>
    </main>
  );
}
