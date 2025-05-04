import React from "react";
import "/src/pages/css/admin.css";
import LogOutButton from "/src/components/LogOutButton.jsx";
import logoBlanco from "/src/pages/images/LogoBlanco.png";
import perfil from "/src/pages/images/perfil.png";
import adminPhoto from "/src/pages/images/lewandowski.png";
import MapaLeaflet from "/src/components/MapaLeafletAdmin.jsx";

function Admin() {
  return (
    <div className="admin-page">
      <header className="admin-navbar">
        <div className="admin-logo-section">
          <img src={logoBlanco} alt="Logo" className="admin-logo" />
        </div>
        <div className="admin-navbar-center">
          <a href="#dashboard">Dashboard</a>
          <a href="#estadistiques">Estadístiques</a>
          <a href="#registres">Registres</a>
        </div>
        <div className="admin-navbar-buttons">
          <button onClick={() => window.location.href = "/AdminProfile"}>
            <img src={perfil} alt="Perfil" />
          </button>
          <LogOutButton />
        </div>
      </header>

      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-profile">
            <img src={adminPhoto} alt="Admin" className="admin-photo" />
            <h2 className="admin-name">Nom Admin</h2>
          </div>
          <div className="admin-buttons">
            <button onClick={() => window.location.href = "/gestioUsuaris"}>Gestionar Usuaris</button>
            <button onClick={() => window.location.href = "/gestioReserves"}>Gestionar Reserves</button>
            <button onClick={() => window.location.href = "/gestioCotxes"}>Gestionar Cotxes</button>
          </div>
        </aside>

        {/* Mapa */}
        <main className="admin-map-container">
          <MapaLeaflet />
          <button className="back-btn" onClick={() => window.history.back()}>
            ⬅ Tornar
          </button>
        </main>
      </div>
    </div>
  );
}

export default Admin;

