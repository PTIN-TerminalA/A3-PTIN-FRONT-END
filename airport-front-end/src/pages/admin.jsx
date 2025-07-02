import React, { useEffect, useState } from "react";
import "/src/pages/css/admin.css";
import Cookies from "js-cookie";
import LogOutButton from "/src/components/LogOutButton.jsx";
import logoBlanco from "/src/pages/images/LogoBlanco.png";
import perfil from "/src/pages/images/perfil.png";
import adminPhoto from "/src/pages/images/Portrait_Placeholder.png";
import MapaLeaflet from "/src/components/MapaLeafletAdmin.jsx";

const _apiUrl = "https://flysy.software"
const _apiUrlLocal = "http://127.0.0.1:8000";

function Admin() {
  const [adminName, setAdminName] = useState("");
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccessAndFetchProfile = async () => {
      try {
        const token = Cookies.get("token");
        
        if (!token) {
          setHasAccess(false);
          setIsLoading(false);
          return;
        }

        // Verificar tipo de usuario
        const userTypeResponse = await fetch(`${_apiUrl}/api/get-user-type`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });

        if (userTypeResponse.ok) {
          const userData = await userTypeResponse.json();
          setUserType(userData.user_type);
          
          // Solo permitir acceso a admin y superadmin
          if (userData.user_type === 'admin' || userData.user_type === 'superadmin') {
            setHasAccess(true);
            
            // Si tiene acceso, obtener el perfil
            console.log("Fetching admin profile...");
            const profileResponse = await fetch(`${_apiUrl}/api/profile`, {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
            });
            
            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              setAdminName(profileData.name);
            } else {
              setAdminName("Nom Admin");
            }
          } else {
            setHasAccess(false);
          }
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error("Error verificando acceso:", error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccessAndFetchProfile();
  }, []);

  // Pantalla de carga
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        flexDirection: 'column'
      }}>
        <div>Verificando permisos...</div>
      </div>
    );
  }

  // Pantalla de acceso denegado
  if (!hasAccess) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        flexDirection: 'column',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#dc2626', marginBottom: '1rem', fontSize: '2rem' }}>
          Acceso Denegado
        </h1>
        <p style={{ marginBottom: '0.5rem' }}>
          No tienes permisos para acceder a esta página.
        </p>
        <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
          Tipo de usuario: {userType || 'No identificado'}
        </p>
        <button 
          onClick={() => window.history.back()} 
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Volver
        </button>
      </div>
    );
  }


  return (
    <div className="admin-page">
      <header className="admin-navbar">
        <div className="admin-logo-section">
          <img src={logoBlanco} alt="Logo" className="admin-logo" />
        </div>
        <div className="admin-navbar-buttons">
          <button onClick={() => window.location.href = "/UserProfile"}>
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

