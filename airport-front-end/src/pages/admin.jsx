import React from "react";
import { useNavigate } from 'react-router-dom';
import "./css/admin.css";
import logo from "../pages/images/LogoBlanco.png";
import mapaAdmin from "../pages/images/Plano.png";
import adminPhoto from "../pages/images/lewandowski.png";

function Admin() {
  const navigate = useNavigate();

  return (
    <div className="admin-wrapper">
      <header className="admin-navbar">
        <div className="admin-navbar-left">
          <img src={logo} alt="Logo" className="admin-navbar-logo" />
        </div>
        <div className="admin-navbar-center">
          <a href="#dashboard">Dashboard</a>
          <a href="#estadistiques">Estadístiques</a>
          <a href="#registres">Registres</a>
        </div>
        <div className="admin-navbar-right">
          <button className="btn btn-outline" onClick={() => navigate('/perfil')}>
            Perfil
          </button>
          <button className="btn btn-filled" onClick={() => navigate('/')}>
            Logout
          </button>
        </div>
      </header>

      <div className="admin-main-container">
        <aside className="admin-sidebar">
          <div className="admin-profile">
            <img src={adminPhoto} alt="Admin" className="admin-photo" />
            <h2 className="admin-name">Nom Admin</h2>
          </div>
          <nav className="admin-menu">
            <button className="admin-menu-btn">Gestionar Usuaris</button>
            <button className="admin-menu-btn">Gestionar Reserves</button>
            <button className="admin-menu-btn">Gestionar Cotxes</button>
          </nav>
        </aside>

        <section className="admin-content">
          <div className="admin-map-container">
            <img
              src={mapaAdmin}
              alt="Mapa administratiu de l'aeroport"
              className="admin-map-image"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Admin;
