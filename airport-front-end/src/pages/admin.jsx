import React from "react";
import "/src/pages/css/admin.css"
import logoBlanco from "/src/pages/images/LogoBlanco.png";
import perfil from "/src/pages/images/perfil.png";
import sortir from "/src/pages/images/apagar.png";
import mapa from "/src/pages/images/Plano.png";

function Admin() {
  return (
    <div className="admin-page">
      <header className="admin-navbar">
        <div className="admin-logo-section">
          <img
            src={logoBlanco}
            alt="Logo"
            className="admin-logo"
          />
          <span className="admin-title">Administrador</span>
        </div>
        <div className="admin-navbar-buttons">
          <button onClick={() => window.location.href = "/perfil"}>
            <img src={perfil} alt="Perfil" />
          </button>
          <button onClick={() => window.location.href = "/"}>
            <img src={sortir} alt="Sortir" />
          </button>
        </div>
      </header>

      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-profile-pic" />
          <p className="admin-name">Nom Administrador</p>

          <div className="admin-buttons">
            <button onClick={() => window.location.href = "/gestioUsuaris"}>Gestionar Usuaris</button>
            <button onClick={() => window.location.href = "/gestioReserves"}>Gestionar Reserves</button>
            <button onClick={() => window.location.href = "/gestioCotxes"}>Gestionar Cotxes</button>
          </div>
        </aside>

        {/* Mapa */}
        <main className="admin-map-container">
          <img src={mapa} alt="Mapa de l'aeroport" className="admin-map-image" />
          <button className="back-btn" onClick={() => window.history.back()}>⬅ Tornar</button>
        </main>
      </div>
    </div>
  );
}

export default Admin;
