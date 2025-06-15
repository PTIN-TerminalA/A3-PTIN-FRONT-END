import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "/src/pages/images/LogoBlanco.png"; 
import "./css/psswdrecov.css";

function PasswordRecovery() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    dni: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");
  try {
    const formDataToSend = new FormData();
    formDataToSend.append("email", formData.email);
    formDataToSend.append("dni", formData.dni);

    const res = await fetch("http://192.168.10.10:8000/api/recovery/request", {
      method: "POST",
      body: formDataToSend,
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(`T'hem enviat un correu a ${formData.email} per reestablir la teva contrasenya.`);
    } else {
      setMessage(`Error: ${data.detail || "No s'ha pogut enviar el correu."}`);
    }
  } catch (err) {
    setMessage("Error de connexió amb el servidor.");
  }
};


  return (
    <div className="recovery-wrapper">
      <header className="recovery-header">
        <img src={logo} alt="Logo" className="recovery-logo" />
      </header>

      <main className="recovery-content">
        <h1 className="recovery-title">Recuperació de Contrasenya</h1>

        <form onSubmit={handleSubmit} className="recovery-form">
          <div className="recovery-inputGroup">
            <label htmlFor="email">Correu electrònic</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Ex: joan@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="recovery-inputGroup">
            <label htmlFor="dni">DNI</label>
            <input
              type="text"
              id="dni"
              name="dni"
              placeholder="Ex: 12345678A"
              value={formData.dni}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="recovery-button">
            Recuperar contrasenya
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="recovery-button"
          >
            Tornar enrere
          </button>
        </form>

        {message && <div className="recovery-message">{message}</div>}
      </main>
    </div>
  );
}

export default PasswordRecovery;
