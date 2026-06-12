import React from 'react';
import './App.css'; 
import backgroundImage from '../media/image/wall.png'; 

export default function App() {
  return (
    <div className="urban-container">
      
      {/* 1. IMAGE DE FOND */}
      <div 
        className="urban-bg" 
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="urban-overlay" />
      </div>

      {/* 2. BARRE DE NAVIGATION */}
      <header className="urban-header">
        <div className="urban-navbar">
          
          {/* Logo */}
          <div className="urban-logo pixel-text" style={{ fontSize: '1.2rem' }}>
            Project<span style={{ fontSize: '0.75rem', color: '#fff' }}>R</span>
          </div>

          {/* Liens de navigation */}
          <ul className="urban-nav-links">
            <li><a href="#accueil" className="active pixel-text" style={{ fontSize: '0.7rem' }}>Accueil</a></li>
            <li><a href="#jeu" className="pixel-text" style={{ fontSize: '0.7rem' }}>Jeu</a></li>
            <li><a href="#factions" className="pixel-text" style={{ fontSize: '0.7rem' }}>Collection</a></li>
          </ul>

          {/* Bouton d'action */}
          <div>
            <button className="btn-play-top pixel-text" style={{ fontSize: '0.65rem', padding: '10px 20px' }}>
              se connecter
            </button>
          </div>

        </div>
      </header>

      {/* 3. SECTION CENTRALE (HERO) */}
      <main className="urban-main">
        
        {/* Titres empilés style BD */}
        <div className="urban-title-container">
          <h1 className="urban-title-main">Project</h1>
          <h2 className="urban-title-sub">Star résonance</h2>
          <span className="urban-tag">Beyond the Stars</span>
        </div>

        {/* Bouton central circulaire Play */}
        <div className="urban-central-button" role="button" aria-label="Lancer le jeu">
          <div className="urban-central-inner">
            <div className="play-triangle" />
          </div>
        </div>

      </main>

      {/* 4. FOOTER DES PLATEFORMES (VERSION FINIE) */}
      <footer className="urban-footer">
        <div className="urban-footer-container">
          
          {/* Badge Discord compacté sur un seul axe */}
          <div className="platform-badge">
            <span className="platform-icon">👾</span>
            <div className="platform-text pixel-text">
              <span className="sub">Rejoindre le</span>
              <span className="main">Discord</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}