// src/components/GestioUsuaris.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import logo from "/src/pages/images/LogoBlanco.png";
import perfil from "/src/pages/images/perfil.png";
import adminPhoto from "/src/pages/images/Portrait_Placeholder.png";
import LogOutButton from "/src/components/LogOutButton.jsx";
import "./css/gestusersa.css";

const API_BASE_URL = "https://flysy.software";
const PAGE_SIZE = 30;

export default function GestioUsuaris() {
  const navigate = useNavigate();

  // ─── ESTATS CREACIÓ ───────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    secondLastName: "",
    dni: "",
    email: "",
    prefix: "+34",
    phoneNumber: "",
    gender: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    requiredFields: true,
    passwordMatch: true,
    isAdult: true,
    dniFormat: true,
    passwordStrength: true,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ─── ESTATS LLISTA ────────────────────────────────────────────────────
  const [users, setUsers] = useState([]);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // ─── BUSCADOR ─────────────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState("");
  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  // ─── EDICIÓ INLINE ────────────────────────────────────────────────────
  const [editingId, setEditingId] = useState(null);
  const [editedUser, setEditedUser] = useState({});

  // ─── VALIDACIÓ FORMULARI ─────────────────────────────────────────────
  const validateForm = () => {
    let valid = true;
    let newErrors = {
      requiredFields: true,
      passwordMatch: true,
      isAdult: true,
      dniFormat: true,
      passwordStrength: true,
    };

    // Camps obligatoris
    const required = [
      "firstName","lastName","secondLastName","dni",
      "email","phoneNumber","gender","birthDate",
      "password","confirmPassword"
    ];
    if (required.some(f => !formData[f].trim())) {
      valid = false;
      newErrors.requiredFields = false;
    }

    // Match de passwords
    if (formData.password !== formData.confirmPassword) {
      valid = false;
      newErrors.passwordMatch = false;
    }

    // Major d'edat
    if (formData.birthDate) {
      const bd = new Date(formData.birthDate);
      const now = new Date();
      let age = now.getFullYear() - bd.getFullYear();
      if (
        now.getMonth() < bd.getMonth() ||
        (now.getMonth() === bd.getMonth() && now.getDate() < bd.getDate())
      ) age--;
      if (age < 18) {
        valid = false;
        newErrors.isAdult = false;
      }
    }

    // Format DNI
    if (!/^\d{8}[A-Za-z]$/.test(formData.dni)) {
      valid = false;
      newErrors.dniFormat = false;
    }

    // Força de la password
    const pw = formData.password;
    const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]|\\:;,.<>?\/]).{8,}$/.test(pw);
    if (!strong) {
      valid = false;
      newErrors.passwordStrength = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // ─── MANEJADOR CREACIÓ ─────────────────────────────────────────────────
  const handleCreateChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async e => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!validateForm()) {
      setErrorMessage("Completa el formulari correctament.");
      return;
    }

    try {
      const fullName = `${formData.firstName} ${formData.lastName} ${formData.secondLastName}`;
      // 1) Crear user base
      const regRes = await fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          dni: formData.dni,
          email: formData.email,
          password: formData.password,
          usertype: 1
        })
      });
      if (!regRes.ok) {
        const err = await regRes.json();
        throw new Error(err.detail || "Error en registrar usuari");
      }
      const { access_token: token } = await regRes.json();

      // 2) Crear dades regular
      const regRegRes = await fetch(`${API_BASE_URL}/api/register-regular`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          birth_date: formData.birthDate,
          phone_num: formData.prefix + formData.phoneNumber,  // <<< prefix + número
          identity: formData.gender
        })
      });
      if (!regRegRes.ok) {
        const err2 = await regRegRes.json();
        throw new Error(err2.detail || "Error dades addicionals");
      }

      setSuccessMessage("Usuari creat correctament");
      setFormData({
        firstName:"", lastName:"", secondLastName:"",
        dni:"", email:"", prefix:"+34", phoneNumber:"", gender:"",
        birthDate:"", password:"", confirmPassword:""
      });
      fetchUsers(0, false);

    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // ─── CARREGAR USUARIS ──────────────────────────────────────────────────
  const fetchUsers = async (newOffset = 0, append = false) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/users?limit=${PAGE_SIZE}&offset=${newOffset}`
      );
      const data = await res.json();
      setTotal(data.total);
      setUsers(prev => append ? [...prev, ...data.users] : data.users);
      setOffset(newOffset + PAGE_SIZE);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // ─── EDICIÓ INLINE ─────────────────────────────────────────────────────
  const startEdit = u => { setEditingId(u.id); setEditedUser({ ...u }); };
  const cancelEdit = () => { setEditingId(null); setEditedUser({}); };
  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };
  const saveEdit = async () => {
    await fetch(`${API_BASE_URL}/api/users/${editingId}/full`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editedUser.name,
        birth_date: editedUser.birth_date,
        phone_num: editedUser.phone_num
        // NO es modifica gender aquí
      })
    });
    cancelEdit();
    fetchUsers(0, false);
  };
  const deleteUser = id => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    fetch(`${API_BASE_URL}/api/users/${id}/full`, { method: "DELETE" })
      .then(() => fetchUsers(0, false))
      .catch(console.error);
  };

  useEffect(() => { fetchUsers(0, false); }, []);

  return (
    <div className="admin-page">
      <header className="admin-navbar">
        <div className="admin-logo-section">
          <img src={logo} alt="Logo" className="admin-logo" />
        </div>
        <div className="admin-navbar-center">
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/estadistiques")}>Estadístiques</button>
          <button onClick={() => navigate("/registres")}>Registres</button>
        </div>
        <div className="admin-navbar-buttons">
          <button onClick={() => navigate("/AdminProfile")}>
            <img src={perfil} alt="Perfil" className="admin-icon" />
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

        <main className="full-width-content">
          <h1 className="section-title">Gestió d'Usuaris</h1>

          {/* CREACIÓ NOU USUARI */}
          <div className="horizontal-section nova-usuari-container">
            <h2>Crear nou usuari</h2>
            {successMessage && <div className="success-message">{successMessage}</div>}
            {errorMessage   && <div className="error-message">{errorMessage}</div>}

            <form className="nova-usuari-form" onSubmit={handleCreateUser}>
              <input name="firstName" placeholder="Nom" value={formData.firstName} onChange={handleCreateChange}/>
              {!errors.requiredFields && !formData.firstName && <span className="error">Camp obligatori</span>}

              <input name="lastName" placeholder="Cognom" value={formData.lastName} onChange={handleCreateChange}/>
              {!errors.requiredFields && !formData.lastName && <span className="error">Camp obligatori</span>}

              <input name="secondLastName" placeholder="2n Cognom" value={formData.secondLastName} onChange={handleCreateChange}/>
              {!errors.requiredFields && !formData.secondLastName && <span className="error">Camp obligatori</span>}

              <input name="dni" placeholder="DNI" value={formData.dni} onChange={handleCreateChange}/>
              {!errors.requiredFields && !formData.dni && <span className="error">Camp obligatori</span>}
              {!errors.dniFormat && <span className="error">Format invàlid</span>}

              <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleCreateChange}/>
              {!errors.requiredFields && !formData.email && <span className="error">Camp obligatori</span>}

              <div className="phone-wrapper">
                <select name="prefix" value={formData.prefix} onChange={handleCreateChange} className="prefix-select">
                  <option value="+34">+34 (Espanya)</option>
                  <option value="+376">+376 (Andorra)</option>
                </select>
                <input name="phoneNumber" placeholder="Telèfon mòbil" value={formData.phoneNumber} onChange={handleCreateChange}/>
              </div>
              {!errors.requiredFields && !formData.phoneNumber && <span className="error">Camp obligatori</span>}

              <select name="gender" value={formData.gender} onChange={handleCreateChange}>
                <option value="">Gènere</option>
                <option value="male">Home</option>
                <option value="female">Dona</option>
                <option value="other">Altre</option>
                <option value="rather_not_to_say">Prefereixo no dir-ho</option>
              </select>
              {!errors.requiredFields && !formData.gender && <span className="error">Camp obligatori</span>}

              <input name="birthDate" type="date" value={formData.birthDate} onChange={handleCreateChange}/>
              {!errors.requiredFields && !formData.birthDate && <span className="error">Camp obligatori</span>}
              {!errors.isAdult && <span className="error">Has de ser major d'edat</span>}

              <input name="password" type="password" placeholder="Contrasenya" value={formData.password} onChange={handleCreateChange}/>
              {!errors.requiredFields && !formData.password && <span className="error">Camp obligatori</span>}
              {!errors.passwordStrength && <span className="error">Contrasenya feble</span>}

              <input name="confirmPassword" type="password" placeholder="Confirma contrasenya" value={formData.confirmPassword} onChange={handleCreateChange}/>
              {!errors.requiredFields && !formData.confirmPassword && <span className="error">Camp obligatori</span>}
              {!errors.passwordMatch && <span className="error">Les contrasenyes no coincideixen</span>}

              <button type="submit" className="btn btn-filled">Crear Usuari</button>
            </form>
          </div>

          {/* CERCA USUARI */}
          <div className="horizontal-section search-container">
            <h2>Buscar usuari</h2>
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Introdueix l'email"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm("")}>✕</button>
              )}
            </div>
          </div>

          {/* TAULA USUARIS */}
          <div className="table-container">
            <table className="gestio-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Data naixement</th>
                  <th>Telèfon</th>
                  <th>Gènere</th>
                  <th>Accions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => {
                  const isEdit = editingId === u.id;
                  return (
                    <tr key={u.id}>
                      <td className="avatar-cell">
                        <img
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}`}
                          className="table-avatar"
                          alt="Avatar"
                        />
                      </td>
                      <td>
                        {isEdit
                          ? <input className="inline-input" name="name" value={editedUser.name} onChange={handleEditChange}/>
                          : u.name}
                      </td>
                      <td>{u.email}</td>
                      <td>
                        {isEdit
                          ? <input type="date" className="inline-input" name="birth_date" value={editedUser.birth_date?.split("T")[0]||""} onChange={handleEditChange}/>
                          : (u.birth_date?.split("T")[0] || "-")}
                      </td>
                      <td>
                        {isEdit
                          ? <input className="inline-input" name="phone_num" value={editedUser.phone_num} onChange={handleEditChange}/>
                          : (u.phone_num || "-")}
                      </td>
                      <td>{u.gender || "-"}</td>
                      <td className="action-cell">
                        {isEdit
                          ? <>
                              <button className="btn-outline small" onClick={saveEdit}>Guardar</button>
                              <button className="btn-filled small" onClick={cancelEdit}>Cancel·lar</button>
                            </>
                          : <>
                              <button className="btn-outline small" onClick={() => startEdit(u)}>Editar</button>
                              <button className="btn-filled small" onClick={() => deleteUser(u.id)}>El·liminar</button>
                            </>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* BOTÓ CARREGAR MÉS */}
          {offset < total && (
            <div style={{ textAlign: "center", margin: "1rem 0" }}>
              <button className="btn btn-filled" disabled={loading} onClick={() => fetchUsers(offset, true)}>
                {loading ? "Carregant..." : "Carregar més"}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
