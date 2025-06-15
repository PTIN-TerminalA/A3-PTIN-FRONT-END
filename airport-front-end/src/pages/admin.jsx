import React, { useEffect, useState } from "react";
import "/src/pages/css/admin.css";
import Cookies from "js-cookie";
import LogOutButton from "/src/components/LogOutButton.jsx";
import logoBlanco from "/src/pages/images/LogoBlanco.png";
import perfil from "/src/pages/images/perfil.png";
import adminPhoto from "/src/pages/images/Portrait_Placeholder.png";
import MapaLeaflet from "/src/components/MapaLeafletAdmin.jsx";

const _apiUrl = "https://flysy.software"
const _apiUrlLocal = "http://localhost:8000";

function Admin() {
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("Fetching admin profile...");
        const token = Cookies.get("token");
        const response = await fetch(`${_apiUrl}/api/profile`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAdminName(data.name);
        } else {
          setAdminName("Nom Admin");
        }
      } catch (error) {
        setAdminName("Nom Admin");
      }
    };
    fetchProfile();
  }, []);

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
            <h2 className="admin-name">{adminName || "Nom Admin"}</h2>
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

