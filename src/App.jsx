import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import backgroundImage from '../media/image/wall.png';
import { login, me, register } from './api/authApi.ts';

const initialFormState = {
  account_name: '',
  mail: '',
  password: '',
  confirmPassword: '',
};

const storageKey = 'project_air_auth_token';

function extractToken(payload) {
  return (
    payload?.token ??
    payload?.access_token ??
    payload?.accessToken ??
    payload?.jwt ??
    payload?.data?.token ??
    null
  );
}

function extractMessage(payload, fallback) {
  return payload?.message ?? payload?.error ?? payload?.detail ?? fallback;
}

function hasAccountShape(payload) {
  return Boolean(payload?.account_name || payload?.mail || payload?.user || payload?.id);
}

export default function App() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [session, setSession] = useState(null);

  const isRegister = mode === 'register';

  const submitLabel = useMemo(
    () => (isRegister ? 'Créer mon compte' : 'Se connecter'),
    [isRegister],
  );

  useEffect(() => {
    const token = window.localStorage.getItem(storageKey);

    if (!token) {
      setCheckingSession(false);
      return;
    }

    let isMounted = true;

    me(token)
      .then((profile) => {
        if (!isMounted) {
          return;
        }

        if (hasAccountShape(profile)) {
          setSession({ token, profile });
          setSuccess('Session déjà active.');
        } else {
          window.localStorage.removeItem(storageKey);
        }
      })
      .catch(() => {
        window.localStorage.removeItem(storageKey);
      })
      .finally(() => {
        if (isMounted) {
          setCheckingSession(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetMessages() {
    setError('');
    setSuccess('');
  }

  function resetToLogin() {
    setMode('login');
    setForm((current) => ({
      ...current,
      password: '',
      confirmPassword: '',
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    resetMessages();

    if (isRegister && form.password !== form.confirmPassword) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    try {
      const payload = isRegister
        ? {
            account_name: form.account_name.trim(),
            mail: form.mail.trim(),
            password: form.password,
          }
        : {
            mail: form.mail.trim(),
            password: form.password,
          };

      const response = isRegister
        ? await register(payload)
        : await login(payload);

      const token = extractToken(response);
      const message = extractMessage(
        response,
        isRegister ? 'Compte créé avec succès.' : 'Connexion effectuée.',
      );

      if (response?.error || response?.errors || response?.status === 'error') {
        setError(message);
        return;
      }

      if (isRegister) {
        setSuccess(message);
        setMode('login');
        setForm((current) => ({
          ...current,
          account_name: '',
          password: '',
          confirmPassword: '',
        }));
        return;
      }

      if (token) {
        window.localStorage.setItem(storageKey, token);
      }

      setSession({
        token,
        profile: response,
      });
      setSuccess(message);
    } catch (submitError) {
      setError(submitError?.message || 'Impossible de contacter le serveur auth.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-background" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="auth-background-overlay" />
        <div className="auth-background-orb auth-background-orb-left" />
        <div className="auth-background-orb auth-background-orb-right" />
      </div>

      <header className="auth-header">
        <div className="auth-brand pixel-text">
          <span className="auth-brand-main">Project</span>
          <span className="auth-brand-accent">Air</span>
        </div>

        <div className="auth-header-actions">
          <button
            type="button"
            className="auth-header-button pixel-text"
            onClick={() => setMode(isRegister ? 'login' : 'register')}
          >
            {isRegister ? 'J’ai déjà un compte' : 'Créer un compte'}
          </button>
        </div>
      </header>

      <main className="auth-main">
        <section className="auth-hero">
          <h1 className="auth-title">
            <span>Star</span>
            <span>Résonance</span>
          </h1>
          <p className="auth-description">
            Connecte-toi ou crée un compte pour accéder à l’univers Project Air.
          </p>

          {session ? (
            <div className="auth-session-card">
              <span className="auth-session-label pixel-text">Session active</span>
              <p>
                {session.profile?.account_name || session.profile?.mail || 'Utilisateur connecté'}
              </p>
            </div>
          ) : null}
        </section>

        <section className="auth-panel" aria-label="Formulaire d’authentification">
          <div className="auth-panel-top">
            <div>
              <p className="auth-panel-eyebrow pixel-text">{isRegister ? 'Inscription' : 'Connexion'}</p>
              <h2>{isRegister ? 'Ouvrir un compte' : 'Reprendre la partie'}</h2>
            </div>

            <div className="auth-tabs" role="tablist" aria-label="Choisir le mode d’authentification">
              <button
                type="button"
                role="tab"
                aria-selected={!isRegister}
                className={!isRegister ? 'is-active' : ''}
                onClick={() => setMode('login')}
              >
                Login
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={isRegister}
                className={isRegister ? 'is-active' : ''}
                onClick={() => setMode('register')}
              >
                Signup
              </button>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister ? (
              <label className="auth-field">
                <span className="pixel-text">Nom de compte</span>
                <input
                  type="text"
                  name="account_name"
                  autoComplete="nickname"
                  value={form.account_name}
                  onChange={(event) => updateField('account_name', event.target.value)}
                  placeholder="ex. NovaPilot"
                  required
                />
              </label>
            ) : null}

            <label className="auth-field">
              <span className="pixel-text">Adresse mail</span>
              <input
                type="email"
                name="mail"
                autoComplete="email"
                value={form.mail}
                onChange={(event) => updateField('mail', event.target.value)}
                placeholder="pilot@project-air.io"
                required
              />
            </label>

            <label className="auth-field">
              <span className="pixel-text">Mot de passe</span>
              <input
                type="password"
                name="password"
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
                placeholder="••••••••••"
                required
              />
            </label>

            {isRegister ? (
              <label className="auth-field">
                <span className="pixel-text">Confirmer le mot de passe</span>
                <input
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={(event) => updateField('confirmPassword', event.target.value)}
                  placeholder="••••••••••"
                  required
                />
              </label>
            ) : null}

            {error ? <div className="auth-alert auth-alert-error">{error}</div> : null}
            {success ? <div className="auth-alert auth-alert-success">{success}</div> : null}

            <button type="submit" className="auth-submit pixel-text" disabled={loading}>
              {loading ? 'Chargement...' : submitLabel}
            </button>
          </form>
        </section>
      </main>

      <footer className="auth-footer">
      </footer>
    </div>
  );
}