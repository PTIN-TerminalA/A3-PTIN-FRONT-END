import React, { useState } from "react";
import logo from "/src/logo.jpeg";
import "./login.css";
import { useNavigate } from "react-router-dom"; // Para la navegación entre páginas

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(`Benvingut, ${formData.username}`);
  };

  return (
    <div className="container">
      {/* Franja superior */}
      <div className="header">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      {/* Título */}
      <h2 className="title">Inici de Sessió</h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="form">
        <div className="inputGroup">
          <label htmlFor="username">Nom d'usuari</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Ex: joan123"
          />
        </div>

        <div className="inputGroup">
          <label htmlFor="password">Contrasenya</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="********"
          />
        </div>

        <button type="submit" className="button">Iniciar sessió</button>
      </form>

      {message && <div className="message">{message}</div>}

      {/* Enlaces adicionales */}
      <div className="extra-options">
        <button onClick={() => navigate("/psswdrecov")} className="link-button">
          Has oblidat la teva contrasenya?
        </button>
        <button onClick={() => navigate("/register")} className="link-button">
          Registrar-se
        </button>
      </div>

      <button type="button" onClick={() => window.history.back()} className="button">
        Tornar enrere
      </button>
    </div>
  );
}

export default Login;
