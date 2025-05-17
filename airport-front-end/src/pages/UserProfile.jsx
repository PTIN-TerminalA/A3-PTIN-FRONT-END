import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import "/src/pages/css/UserProfile.css";
import LogOutButton from "/src/components/LogOutButton.jsx";
import logoBlanco from "/src/pages/images/LogoBlanco.png";
import perfil from "/src/pages/images/perfil.png";
import userPhoto from "/src/pages/images/lewandowski.png";

function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // Perfil
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [birthDate, setBirthDate] = useState("1990-01-01");
  const [phoneNum, setPhoneNum]   = useState("");
  const [identity, setIdentity]   = useState("rather_not_to_say");

  // Opciones
  const genderOptions = [
    { value: "female", label: "Female" },
    { value: "male", label: "Male" },
    { value: "other", label: "Other" },
    { value: "rather_not_to_say", label: "Rather not to say" }
  ];
  const years  = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  const months = Array.from({ length: 12 }, (_, i) => String(i+1).padStart(2,"0"));
  const days   = Array.from({ length: 31 }, (_, i) => String(i+1).padStart(2,"0"));

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      setError("No s'ha trobat sessió activa.");
      setLoading(false);
      return;
    }
    fetch("http://localhost:8000/api/profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then(data => {
        setName(data.name);
        setEmail(data.email);
        setBirthDate(data.birth_date);
        setPhoneNum(data.phone_num);
        setIdentity(data.identity);
        setLoading(false);
      })
      .catch(() => {
        setError("No s'han pogut carregar les dades.");
        setLoading(false);
      });
  }, []);

  const handleSave = () => {
    const token = Cookies.get("token");
    fetch("http://localhost:8000/api/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name,
        birth_date: birthDate,
        phone_num: phoneNum,
        identity
      })
    })
      .then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        alert("Perfil actualitzat correctament!");
      })
      .catch(() => alert("Error actualitzant el perfil."));
  };

  if (loading) return <p className="user-loading">Carregant perfil...</p>;
  if (error)   return <p className="user-error">{error}</p>;

  const [y, m, d] = birthDate.split("-");

  return (
    <div className="user-page">
      <header className="user-navbar">
        <div className="user-logo-section">
          <img src={logoBlanco} alt="Logo" className="user-logo" />
        </div>
        <div className="user-navbar-buttons">
          <button onClick={() => window.location.href = "/UserProfile"}>
            <img src={perfil} alt="Perfil" />
          </button>
          <LogOutButton />
        </div>
      </header>

      <main className="user-content">
        <div className="user-card">
          <img src={userPhoto} alt="Usuari" className="user-photo" />

          <div className="user-info">
            <div className="user-field">
              <label>Nom</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="user-field">
              <label>Correu Electrònic</label>
              <input type="email" value={email} disabled />
            </div>
            <div className="user-field">
              <label>Data de Naixement</label>
              <div className="date-selects">
                <select value={y} onChange={e => setBirthDate(`${e.target.value}-${m}-${d}`)}>
                  {years.map(yr => <option key={yr} value={yr}>{yr}</option>)}
                </select>
                <select value={m} onChange={e => setBirthDate(`${y}-${e.target.value}-${d}`)}>
                  {months.map(mm => <option key={mm} value={mm}>{mm}</option>)}
                </select>
                <select value={d} onChange={e => setBirthDate(`${y}-${m}-${e.target.value}`)}>
                  {days.map(dd => <option key={dd} value={dd}>{dd}</option>)}
                </select>
              </div>
            </div>
            <div className="user-field">
              <label>Telèfon</label>
              <input type="text" value={phoneNum} onChange={e => setPhoneNum(e.target.value)} />
            </div>
            <div className="user-field">
              <label>Gènere</label>
              <select value={identity} onChange={e => setIdentity(e.target.value)}>
                {genderOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="user-buttons">
            <button className="save-btn" onClick={handleSave}>
              Guardar canvis
            </button>
            <button
              className="reserves-button"
              onClick={() => window.location.href = "/userReserves"}
            >
              Les meves Reserves
            </button>
            <button className="delete-account">
              Vull eliminar el meu compte
            </button>
          </div>
        </div>
      </main>

      <footer className="user-main-footer lowered-footer">
        <div className="user-footer-columns">
          <div className="user-footer-col">
            <h4>Serveis</h4>
            <ul>
              <li>Informació de vols</li>
              <li>Botigues i restauració</li>
              <li>Transport</li>
              <li>Accessibilitat</li>
            </ul>
          </div>
          <div className="user-footer-col">
            <h4>Xarxes Socials</h4>
            <div className="user-social-icons">
              <span className="user-icon-placeholder">F</span>
              <span className="user-icon-placeholder">G+</span>
              <span className="user-icon-placeholder">T</span>
              <span className="user-icon-placeholder">Y</span>
            </div>
          </div>
          <div className="user-footer-col">
            <h4>Contacte</h4>
            <p>Necessites ajuda? Truca'ns ara</p>
            <p className="user-footer-phone">+34 600 000 000</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default UserProfile;
