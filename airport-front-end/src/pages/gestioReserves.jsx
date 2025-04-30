import React, { useState, useEffect } from "react";
import { useNavigate }         from 'react-router-dom';
import Cookies                 from 'js-cookie';
import "./css/gestioreserves.css";
import logo                    from "../pages/images/LogoBlanco.png";
import adminPhoto              from "../pages/images/lewandowski.png";
import LogOutButton            from "/src/components/LogOutButton.jsx";
import perfil                  from "/src/pages/images/perfil.png";

export default function GestioReserves() {
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

  // cargar reservas
  useEffect(fetchReserves, []);

  function fetchReserves() {
    const token = Cookies.get("token");
    const qs = new URLSearchParams(filters).toString();
    fetch(`http://localhost:8000/reserves?${qs}`, {
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
    fetch("http://localhost:8000/reserves/programada", {
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
    fetch(`http://localhost:8000/reserves/${id}`, {
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
    fetch(`http://localhost:8000/reserves/${id}`, {
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

  return (
    <div className="gestio-wrapper">
      <header className="admin-navbar">
        <div className="admin-logo-section">
          <img src={logo} alt="Logo" className="admin-logo" />
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

      <h1 className="page-title">Gestió de Reserves</h1>

      {/* Crear reserva */}
      <section className="nova-reserva-section">
        <h2>Nova Reserva</h2>
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
      </section>

      {/* Filtros */}
      <section className="filters-bar">
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
      </section>

      {/* Tabla */}
      <section className="reserves-section">
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
              <tr key={r._id}>
                <td>{r.user_email}</td>
                <td>{r.start_location}</td>
                <td>{r.end_location}</td>
                <td>{new Date(r.scheduled_time).toLocaleString()}</td>
                <td>{r.state}</td>
                <td>
                  <button
                    className="btn btn-outline small"
                    onClick={() => handleUpdate(r._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-filled small"
                    onClick={() => handleDelete(r._id)}
                  >
                    Cancel·lar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
