import React from "react";
import { useNavigate } from 'react-router-dom';
import "./css/home.css";
import logo from "../pages/images/LogoBlanco.png";
import aiIcon from "../pages/images/AI.png";
import itIcon from "../pages/images/IT.png";
import phoneIcon from "../pages/images/telefono.png";

const whoAreWe = `
  Amb Vilanova Intelligent Airport és més fàcil que mai aprofitar el temps a l'aeroport. Amb la nostra app, pots gaudir d'una experiència única. No tornaràs a perdre un vol per estar mirant botigues dins de l'aeroport o per voler anar a menjar alguna cosa.

  Amb la nostra app podràs veure totes les botigues i restaurants de l'aeroport, així com els seus horaris d'obertura i tancament.
  A més, podràs veure quines botigues estan més a prop de la teva porta d'embarcament i podràs fer un recorregut personalitzat perquè un dels nostres vehicles autònoms et porti a les botigues o restaurants que vulguis visitar.

  Amb Vilanova Intelligent Airport, el temps d'espera a l'aeroport es converteix en una experiència agradable i productiva.

  Pots registrar-te des d'aquesta mateixa pàgina web o descarregar-te la nostra aplicació per a smartphones que et permetrà reservar els vehicles així com accedir a tots els nostres serveis.

  Si et registres, rebràs informació sobre ofertes i events especials a l'aeroport, i podràs rebre informació del teu vol
  directament des de la teva aerolinia.
`;


function Home() {
  const navigate = useNavigate();
  return (
    <div className="home-wrapper">
      <header className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Logo" className="navbar-logo" />
        </div>

        <div className="navbar-center">
          <a href="#inici">Inici</a>
          <a href="#vols">Vols</a>
          <a href="#serveis">Serveis</a>
          <a href="#contacte">Contacte</a>
        </div>

        <div className="navbar-right">
          <button className="btn btn-outline" onClick={() => navigate('/login')}>Iniciar Sessió</button>
          <button className="btn btn-filled" onClick={() => navigate('/register')}>Registrar-se</button>
        </div>
      </header>

      <div className="background-section">
        <div className="background-overlay">
          <div className="background-content">
            <h1 className="section-title-home">Qui Som?</h1>
            <p className="section-description">
              {whoAreWe}
            </p>
          </div>
        </div>
      </div>

      <section className="features-section">
        <h2 className="features-title">Per què escollir el nostre aeroport?</h2>
        <p className="features-subtitle">Gaudeix d’una experiència completa des del moment en què arribes.</p>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">
              <img src={aiIcon} alt="Mobilitat Autònoma" />
            </div>
            <h3 className="feature-heading">Mobilitat Autònoma</h3>
            <p className="feature-text">
              Vehicles intel·ligents que et porten d’un lloc a un altre dins de l’aeroport amb total autonomia i eficiència.
            </p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <img src={itIcon} alt="Innovació" />
            </div>
            <h3 className="feature-heading">Innovació</h3>
            <p className="feature-text">
              Sistemes de check-in automàtic i una infraestructura tecnològica de darrera generació.
            </p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <img src={phoneIcon} alt="Atenció al passatger" />
            </div>
            <h3 className="feature-heading">Atenció al passatger</h3>
            <p className="feature-text">
              Suport 24/7, assistència personalitzada i informació en temps real per garantir una experiència còmoda.
            </p>
          </div>
        </div>
      </section>

      <footer className="main-footer">
        <div className="footer-columns">
          <div className="footer-col">
            <h4>Serveis</h4>
            <ul>
              <li>Informació de vols</li>
              <li>Botigues i restauració</li>
              <li>Transport</li>
              <li>Accessibilitat</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Xarxes Socials</h4>
            <div className="social-icons">
              <span className="icon-placeholder">F</span>
              <span className="icon-placeholder">G+</span>
              <span className="icon-placeholder">T</span>
              <span className="icon-placeholder">Y</span>
            </div>
          </div>
          <div className="footer-col">
            <h4>Contacte</h4>
            <p>Necessites ajuda? Truca'ns ara</p>
            <p className="footer-phone">+34 600 000 000</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;