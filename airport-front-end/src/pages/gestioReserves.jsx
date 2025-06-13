import React, { useState, useEffect } from "react";
import { useNavigate }         from 'react-router-dom';
import Cookies                 from 'js-cookie';
import "./css/gestioreserves.css";
import logo                    from "../pages/images/LogoBlanco.png";
import adminPhoto              from "../pages/images/lewandowski.png";
import LogOutButton            from "/src/components/LogOutButton.jsx";
import perfil                  from "/src/pages/images/perfil.png";
import IndoorMap from "/src/components/MapaLeafletRutaReserva.jsx";
import MapaLeafletGestioReservas from "/src/components/MapaLeafletGestioReservas.jsx";


export default function GestioReserves() {
  const _url = "https://flysy.software";
  const navigate = useNavigate();

  // filtros de lectura
  const [filters, setFilters] = useState({
    user_email: "",
    start_location: "",
    end_location: "",
    state: "",
    start_date: "",
    end_date: ""
  });

  // array de reservas
  const [reserves, setReserves] = useState([]);

  // nueva reserva (admin crea para cualquier correo)
  const [newRes, setNewRes] = useState({
    user_email: "",
    start_location: "",
    end_location: "",
    scheduled_time: "",
    state: "Programada"
  });

  const [filteredRoutes, setFilteredRoutes] = useState([]);

  // Estado para la reserva seleccionada
  const [selectedReserve, setSelectedReserve] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

  // cargar reservas
  useEffect(fetchReserves, []);

  function fetchReserves() {
    const token = Cookies.get("token");
    const qs = new URLSearchParams(filters).toString();
    fetch(`${_url}/api/reserves?${qs}`, {
      
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setReserves(data.reserves || []))
      .catch(console.error);
  }

  function handleFilterChange(e) {
    setFilters(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleNewChange(e) {
    setNewRes(r => ({ ...r, [e.target.name]: e.target.value }));
  }

  function handleFilterSubmit(e) {
    e.preventDefault();
    fetchReserves();
  }

  function handleCreate() {
    const token = Cookies.get("token");
    fetch(`${_url}/api/reserves/programada`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newRes)
    })
      .then(r => {
        if (!r.ok) throw new Error();
        fetchReserves();
        setNewRes({
          user_email: "",
          start_location: "",
          end_location: "",
          scheduled_time: "",
          state: "Programada"
        });
      })
      .catch(console.error);
  }

  function handleDelete(id) {
    if (!window.confirm("Segur?")) return;
    const token = Cookies.get("token");
    fetch(`${_url}/api/reserves/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => fetchReserves())
      .catch(console.error);
  }

  function handleUpdate(id) {
    // Abrimos prompt para cada campo editable
    const newStart = prompt("Nova ubicació origen:", "");
    const newEnd   = prompt("Nova ubicació destí:", "");
    const newTime  = prompt("Nova data (YYYY-MM-DDTHH:mm):", "");
    const newState = prompt("Nou estat:", "");
    const update = {};
    if (newStart) update.start_location = newStart;
    if (newEnd)   update.end_location   = newEnd;
    if (newTime)  update.scheduled_time = newTime;
    if (newState) update.state          = newState;

    if (Object.keys(update).length === 0) return;

    const token = Cookies.get("token");
    fetch(`${_url}/api/reserves/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(update)
    })
      .then(r => {
        if (!r.ok) throw new Error();
        fetchReserves();
      })
      .catch(console.error);
  }

  // Cuando cambia la reserva seleccionada, buscar sus coordenadas
  useEffect(() => {
    async function fetchRouteForSelected() {
      if (!selectedReserve) {
        setSelectedRoute(null);
        return;
      }
      if (!selectedReserve.start_location || !selectedReserve.end_location) {
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
            id: selectedReserve._id || selectedReserve.id || selectedReserve.email || Math.random()
          });
        } else {
          setSelectedRoute(null);
        }
      } catch (e) {
        setSelectedRoute(null);
      }
    }
    fetchRouteForSelected();
  }, [selectedReserve]);

  return (
    <div className="admin-page">
      <header className="admin-navbar">
        <div className="admin-logo-section">
          <img src={logo} alt="Logo" className="admin-logo light-mode" />
          <img src={logo} alt="Logo" className="admin-logo dark-mode" />
        </div>
        <div className="admin-navbar-center">
          <a href="#dashboard">Dashboard</a>
          <a href="#estadistiques">Estadístiques</a>
          <a href="#registres">Registres</a>
        </div>
        <div className="admin-navbar-buttons">
          <button onClick={() => navigate("/AdminProfile")}>
            <img src={perfil} alt="Perfil" />
          </button>
          <LogOutButton />
        </div>
      </header>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-profile">
            <img src={adminPhoto} alt="Admin" className="admin-photo" />
            <h2 className="admin-name">Nom Admin</h2>
          </div>
          <div className="admin-buttons">
            <button onClick={() => navigate("/gestioUsuaris")}>Gestionar Usuaris</button>
            <button onClick={() => navigate("/gestioReserves")}>Gestionar Reserves</button>
            <button onClick={() => navigate("/gestioCotxes")}>Gestionar Cotxes</button>
          </div>
        </aside>

        <div className="full-width-content">
          <h1 className="section-title">Gestió de reserves FlySy</h1>

          <div className="horizontal-section nova-reserva-container">
            <h2>Crear nova reserva</h2>
            <div className="nova-reserva-form">
              <input
                name="user_email"
                placeholder="Correu del usuari"
                value={newRes.user_email}
                onChange={handleNewChange}
              />
              <input
                name="start_location"
                placeholder="Origen"
                value={newRes.start_location}
                onChange={handleNewChange}
              />
              <input
                name="end_location"
                placeholder="Destí"
                value={newRes.end_location}
                onChange={handleNewChange}
              />
              <input
                name="scheduled_time"
                type="datetime-local"
                value={newRes.scheduled_time}
                onChange={handleNewChange}
              />
              <select
                name="state"
                value={newRes.state}
                onChange={handleNewChange}
              >
                <option>Programada</option>
                <option>En curs</option>
                <option>Finalitzada</option>
              </select>
              <button className="btn btn-filled" onClick={handleCreate}>
                Afegir Reserva
              </button>
            </div>
          </div>

          <div className="horizontal-section filter-container">
            <h2>Filtrar Reserva</h2>
            <form className="filters-form" onSubmit={handleFilterSubmit}>
              <input
                name="user_email"
                placeholder="Filtrar per email"
                value={filters.user_email}
                onChange={handleFilterChange}
              />
              <input
                name="start_location"
                placeholder="Origen"
                value={filters.start_location}
                onChange={handleFilterChange}
              />
              <input
                name="end_location"
                placeholder="Destí"
                value={filters.end_location}
                onChange={handleFilterChange}
              />
              <select
                name="state"
                value={filters.state}
                onChange={handleFilterChange}
              >
                <option value="">Tots estats</option>
                <option>Programada</option>
                <option>En curs</option>
                <option>Finalitzada</option>
              </select>
              <input
                name="start_date"
                type="date"
                value={filters.start_date}
                onChange={handleFilterChange}
              />
              <input
                name="end_date"
                type="date"
                value={filters.end_date}
                onChange={handleFilterChange}
              />
              <button type="submit" className="btn btn-filled">
                Filtrar
              </button>
            </form>
          </div>

          <div className="horizontal-section table-container">
            <table className="gestio-table">
              <thead>
                <tr>
                  <th>Email Usuari</th>
                  <th>Origen</th>
                  <th>Destí</th>
                  <th>Data Inici</th>
                  <th>Estat</th>
                  <th>Accions</th>
                </tr>
              </thead>
              <tbody>
                {reserves.map(r => (
                  <tr key={r._id} style={{ cursor: 'pointer', background: selectedReserve && selectedReserve._id === r._id ? '#e0e7ff' : undefined }}
                      onClick={() => setSelectedReserve(r)}>
                    <td>{r.user_email}</td>
                    <td>{r.start_location}</td>
                    <td>{r.end_location}</td>
                    <td>{new Date(r.scheduled_time).toLocaleString()}</td>
                    <td>{r.state}</td>
                    <td>
                      <button
                        className="btn btn-outline small"
                        onClick={e => { e.stopPropagation(); handleUpdate(r._id); }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-filled small"
                        onClick={e => { e.stopPropagation(); handleDelete(r._id); }}
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