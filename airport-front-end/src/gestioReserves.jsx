import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import "./css/gestioreserves.css";
import logo from "../pages/images/LogoBlanco.png";
import adminPhoto from "../pages/images/lewandowski.png";
import LogOutButton from "/src/components/LogOutButton.jsx";
import perfil from "/src/pages/images/perfil.png";

function GestioReserves() {
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startPoint, setStartPoint] = useState("");
  const [endPoint, setEndPoint] = useState("");
  const [email, setEmail] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [reserves, setReserves] = useState([]);
  const [newReserveType, setNewReserveType] = useState("programada");
  const [newReserveEmail, setNewReserveEmail] = useState("");
  const [newReserveStart, setNewReserveStart] = useState("");
  const [newReserveEnd, setNewReserveEnd] = useState("");
  const [newReserveDate, setNewReserveDate] = useState("");

  const ubicacions = [
    "Porta A3", "Pàrquing", "McDonald's", "Starbucks", "Porta A2",
    "Serveis 1", "FCB Store", "Farmàcia", "Porta A1", "Punt Info. 2",
    "H&M", "Cafè", "Serveis 2", "Porta A4", "VIP A4",
    "Reclamació equipatge", "Control Seguretat", "Punt Info. 1",
    "Zona Check-in", "Levi's", "Parada Taxi"
  ];

  const estados = ["Programada", "En curs", "Finalitzada"];

  const fetchReserves = async (filters = {}) => {
    try {
      const token = Cookies.get('token');
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => v && params.append(k, v));
      const url = `http://localhost:8000/reserves?${params.toString()}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setReserves(data.reserves);
    } catch (err) {
      console.error(err);
      setReserves([]);
    }
  };

  useEffect(() => {
    fetchReserves();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchReserves({
      start_date: startDate,
      end_date: endDate,
      start_location: startPoint,
      end_location: endPoint,
      user_email: email,
      state: stateFilter
    });
  };

  const handleCancel = async (id) => {
    const token = Cookies.get('token');
    if (!window.confirm("Segur que vols cancel·lar aquesta reserva?")) return;

    try {
      const res = await fetch(`http://localhost:8000/reserves/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("No s'ha pogut cancel·lar la reserva");

      alert("Reserva cancel·lada correctament.");
      fetchReserves();
    } catch (err) {
      console.error(err);
      alert("Error al cancel·lar la reserva.");
    }
  };

  const handleNewReserve = async () => {
    if (!newReserveEmail || !newReserveStart || !newReserveEnd || (newReserveType === "programada" && !newReserveDate)) {
      alert("Tots els camps són obligatoris.");
      return;
    }

    try {
      const token = Cookies.get('token');
      const userRes = await fetch(`http://localhost:8000/check-user?email=${encodeURIComponent(newReserveEmail)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!userRes.ok) {
        alert("Aquest correu no existeix a la base de dades.");
        return;
      }

      const userData = await userRes.json();
      const userId = userData.id;

      const reservaPayload = {
        start_location: newReserveStart,
        end_location: newReserveEnd,
        scheduled_time: newReserveDate,
        state: newReserveType === "programada" ? "Programada" : "En curs"
      };

      const res = await fetch("http://localhost:8000/reserves/programada", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(reservaPayload)
      });

      if (!res.ok) throw new Error("Error al crear la reserva");

      alert("Reserva creada correctament!");
      fetchReserves();

      setNewReserveEmail("");
      setNewReserveStart("");
      setNewReserveEnd("");
      setNewReserveDate("");

    } catch (err) {
      console.error(err);
      alert("Error al afegir la reserva.");
    }
  };

  return (
    <div className="gestio-wrapper">
      <header className="gestio-navbar">
        <div className="gestio-navbar-left">
          <img src={logo} alt="Logo" className="gestio-logo" />
        </div>
        <div className="gestio-navbar-center">
          <a href="#dashboard">Dashboard</a>
          <a href="#estadistiques">Estadístiques</a>
          <a href="#registres">Registres</a>
        </div>
        <div className="gestio-navbar-buttons">
          <button onClick={() => navigate('/AdminProfile')}>
            <img src={perfil} alt="Perfil" />
          </button>
          <LogOutButton />
        </div>
      </header>

      <div className="gestio-main-container">
        <aside className="gestio-sidebar">
          <div className="gestio-profile">
            <img src={adminPhoto} alt="Admin" className="gestio-photo" />
            <h2 className="gestio-name">Nom Admin</h2>
          </div>
          <nav className="gestio-menu">
            <button 
              className="gestio-menu-btn" 
              onClick={() => navigate('/gestioUsuaris')}
            >
              Gestionar Usuaris
            </button>
            <button className="gestio-menu-btn active">
              Gestionar Reserves
            </button>
            <button 
              className="gestio-menu-btn" 
              onClick={() => navigate('/gestioCotxes')}
            >
              Gestionar Cotxes
            </button>
          </nav>
        </aside>

        <section className="gestio-content">
          <h1 className="gestio-title">Gestió de Reserves</h1>

          <div className="nova-reserva">
            <h2>Nova Reserva</h2>
            <div className="form-row">
              <input
                type="email"
                placeholder="Correu de l'usuari"
                value={newReserveEmail}
                onChange={(e) => setNewReserveEmail(e.target.value)}
                className="large-input"
              />
              <select
                value={newReserveType}
                onChange={(e) => setNewReserveType(e.target.value)}
                className="large-select"
              >
                <option value="programada">Programada</option>
                <option value="instantania" disabled>Instantània</option>
              </select>
              <select
                value={newReserveStart}
                onChange={(e) => setNewReserveStart(e.target.value)}
                className="large-select"
              >
                <option value="">Origen</option>
                {ubicacions.map((loc, index) => (
                  <option key={index} value={loc}>{loc}</option>
                ))}
              </select>
              <select
                value={newReserveEnd}
                onChange={(e) => setNewReserveEnd(e.target.value)}
                className="large-select"
              >
                <option value="">Destí</option>
                {ubicacions.map((loc, index) => (
                  <option key={index} value={loc}>{loc}</option>
                ))}
              </select>
              {newReserveType === "programada" && (
                <input
                  type="datetime-local"
                  value={newReserveDate}
                  onChange={(e) => setNewReserveDate(e.target.value)}
                  className="large-input"
                />
              )}
              <button 
                onClick={handleNewReserve} 
                className="btn btn-filled large-btn"
              >
                Afegir Reserva
              </button>
            </div>
          </div>

          <form className="gestio-filters" onSubmit={handleFilter}>
            <div className="filter-group">
              <label>Data Inici</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Data Fi</label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Origen</label>
              <select
                value={startPoint}
                onChange={(e) => setStartPoint(e.target.value)}
              >
                <option value="">Tots</option>
                {ubicacions.map((loc, index) => (
                  <option key={index} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Destí</label>
              <select
                value={endPoint}
                onChange={(e) => setEndPoint(e.target.value)}
              >
                <option value="">Tots</option>
                {ubicacions.map((loc, index) => (
                  <option key={index} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Correu</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Filtrar per email"
              />
            </div>
            <div className="filter-group">
              <label>Estat</label>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
              >
                <option value="">Tots</option>
                {estados.map((estado, index) => (
                  <option key={index} value={estado}>{estado}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-filled filter-btn">
              Filtrar
            </button>
          </form>

          <div className="gestio-table-container">
            <table className="gestio-table">
              <thead>
                <tr>
                  <th>Usuari</th>
                  <th>Origen</th>
                  <th>Destí</th>
                  <th>Data Inici</th>
                  <th>Estat</th>
                  <th>Accions</th>
                </tr>
              </thead>
              <tbody>
                {reserves.map((r, i) => (
                  <tr key={i}>
                    <td>{r.user_email || r.user_id}</td>
                    <td>{r.start_location}</td>
                    <td>{r.end_location}</td>
                    <td>{new Date(r.scheduled_time).toLocaleString()}</td>
                    <td>{r.state}</td>
                    <td>
                      <button className="btn btn-outline small">Veure</button>
                      <button 
                        className="btn btn-filled small" 
                        onClick={() => handleCancel(r._id)}
                      >
                        Cancel·lar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default GestioReserves;