// src/components/GestioCotxes.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "/src/pages/images/LogoBlanco.png";
import perfil from "/src/pages/images/perfil.png";
import adminPhoto from "/src/pages/images/Portrait_Placeholder.png";
import LogOutButton from "/src/components/LogOutButton.jsx";
import "./css/gestusersa.css";

const API_BASE_URL = "https://flysy.software";

export default function GestioCotxes() {
  const navigate = useNavigate();
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

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/cars`);
      const data = await res.json();
      setCars(data);
    } catch (err) {
      console.error("Error fetching cars:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const stateOptions = [
    { label: "Esperant", value: "esperant" },
    { label: "En curs", value: "en_curs" },
    { label: "Solicitat", value: "solicitat" },
    { label: "Disponible", value: "disponible" },
  ];

  const handleStateChange = async (carId, newState) => {
    const pretty = stateOptions.find(o => o.value === newState)?.label || newState;
    if (!window.confirm(`Segur que vols canviar l’estat a "${pretty}"?`)) {
      return;
    }

    try {
      await fetch(`${API_BASE_URL}/cotxe/${carId}/${newState}`, {
        method: "PUT",
      });
      // Actualització local
      setCars(prev =>
        prev.map(c =>
          c._id === carId
            ? { ...c, state:
                 newState === "en_curs"    ? "En curs" :
                 newState === "esperant"   ? "Esperant" :
                 newState === "solicitat"  ? "Solicitat" :
                 newState === "disponible" ? "Disponible" :
                 c.state
              }
            : c
        )
      );
    } catch (err) {
      console.error(`Error updating state to ${newState}:`, err);
      alert("S'ha produït un error en canviar l'estat.");
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-navbar">
        <div className="admin-logo-section">
          <img src={logo} alt="Logo" className="admin-logo" />
        </div>
        <div className="admin-navbar-buttons">
          <button onClick={() => navigate("/UserProfile")}>
            <img src={perfil} alt="Perfil" />
          </button>
          <LogOutButton />
        </div>
      </header>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-profile">
            <img src={adminPhoto} alt="Admin" className="admin-photo" />
            <h2 className="admin-name">{adminName || "Nom Admin"}</h2>
          </div>
          <div className="admin-buttons">
            <button onClick={() => navigate("/gestioUsuaris")}>Gestionar Usuaris</button>
            <button onClick={() => navigate("/gestioReserves")}>Gestionar Reserves</button>
            <button onClick={() => navigate("/gestioCotxes")}>Gestionar Cotxes</button>
          </div>
        </aside>

        <main className="full-width-content">
          <h1 className="section-title">Gestió de Cotxes</h1>

          <div className="table-container">
            <table className="gestio-table">
              <thead>
                <tr>
                  <th>Id del cotxe</th>
                  <th>Estat</th>
                  <th>Nivell de bateria</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>Carregant...</td>
                  </tr>
                ) : (
                  cars.map(car => (
                    <tr key={car._id}>
                      <td>{car._id}</td>
                      <td>
                        <select
                          className="inline-input"
                          value={car.state.toLowerCase().replace(" ", "_")}
                          onChange={e => handleStateChange(car._id, e.target.value)}
                        >
                          {stateOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>{car.battery_level}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
