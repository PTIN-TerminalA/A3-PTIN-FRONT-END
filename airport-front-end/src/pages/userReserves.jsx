import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import "./css/gestioreserves.css";
import logo from "../pages/images/LogoBlanco.png";
import adminPhoto from "../pages/images/lewandowski.png";
import LogOutButton from "/src/components/LogOutButton.jsx";
import perfil from "/src/pages/images/perfil.png";
import MapaLeafletGestioReservas from "/src/components/MapaLeafletGestioReservas.jsx";

export default function GestioReserves() {
  const _url = "https://flysy.software";
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    user_email: "",
    start_location: "",
    end_location: "",
    state: "",
    start_date: "",
    end_date: ""
  });

  const [reserves, setReserves] = useState([]);
  const [selectedReserve, setSelectedReserve] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  // Obtener perfil y reservas del usuario
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;

    fetch(`${_url}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setUserEmail(data.email);
        const fullName = data.name || "Usuari";
        const [firstName, firstSurname] = fullName.split(" ");
        setUserName(`${firstName} ${firstSurname || ""}`);
        setFilters(prev => ({ ...prev, user_email: data.email }));
      })
      
      .catch(console.error);
  }, []);

  // Cargar reservas cuando se tenga el email
  useEffect(() => {
    if (filters.user_email) fetchReserves();
  }, [filters.user_email]);

  function fetchReserves() {
    const token = Cookies.get("token");
    const qs = new URLSearchParams(filters).toString();
    fetch(`${_url}/reserves?${qs}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setReserves(data.reserves || []))
      .catch(console.error);
  }

  function handleDelete(id) {
    if (!window.confirm("Segur?")) return;
    const token = Cookies.get("token");
    fetch(`${_url}/reserves/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => fetchReserves())
      .catch(console.error);
  }

  useEffect(() => {
    async function fetchRouteForSelected() {
      if (!selectedReserve?.start_location || !selectedReserve?.end_location) {
        setSelectedRoute(null);
        return;
      }
      try {
        const [startRes, endRes] = await Promise.all([
          fetch(`${_url}/api/establishment-position?name=${encodeURIComponent(selectedReserve.start_location)}`),
          fetch(`${_url}/api/establishment-position?name=${encodeURIComponent(selectedReserve.end_location)}`)
        ]);
        const startData = await startRes.json();
        const endData = await endRes.json();
        if (
          typeof startData.location_x === 'number' && typeof startData.location_y === 'number' &&
          typeof endData.location_x === 'number' && typeof endData.location_y === 'number'
        ) {
          setSelectedRoute({
            start: [startData.location_x, startData.location_y],
            end: [endData.location_x, endData.location_y],
            id: selectedReserve._id || Math.random()
          });
        } else {
          setSelectedRoute(null);
        }
      } catch {
        setSelectedRoute(null);
      }
    }
    fetchRouteForSelected();
  }, [selectedReserve]);

  return (
    <div className="admin-page">
      <header className="admin-navbar">
        <div className="admin-logo-section">
          <img src={logo} alt="Logo" className="admin-logo" />
        </div>
        <div className="admin-navbar-center">
         
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
            <h2 className="admin-name">{userName}</h2>
          </div>
        </aside>

        <div className="full-width-content">
          <h1 className="section-title">Reserves de {userName || "FlySy"}</h1>

          <div className="horizontal-section table-container">
            <table className="gestio-table">
              <thead>
                <tr>
                  <th>Origen</th>
                  <th>Destí</th>
                  <th>Data Inici</th>
                  <th>Estat</th>
                  <th>Accions</th>
                </tr>
              </thead>
              <tbody>
                {reserves.map(r => (
                  <tr key={r._id} style={{
                    cursor: 'pointer',
                    background: selectedReserve && selectedReserve._id === r._id ? '#e0e7ff' : undefined
                  }}
                      onClick={() => setSelectedReserve(r)}>
                    <td>{r.start_location}</td>
                    <td>{r.end_location}</td>
                    <td>{new Date(r.scheduled_time).toLocaleString()}</td>
                    <td>{r.state}</td>
                    <td>
                      <button
                        className="btn btn-filled small"
                        onClick={e => {
                          e.stopPropagation();
                          handleDelete(r._id);
                        }}
                      >
                        Cancel·lar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="map-container">
            <MapaLeafletGestioReservas routes={selectedRoute ? [selectedRoute] : []} />
          </div>
        </div>
      </div>
    </div>
  );
}
