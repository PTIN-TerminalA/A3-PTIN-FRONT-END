import React, { useState } from "react";
import logo from "/src/pages/images/LogoBlanco.png";
import "./css/login.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.username,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.detail || "Error al iniciar sesión");
        return;
      }

      const data = await response.json();

      Cookies.set("token", data.access_token,{
        expires: 1,
        //para https -> secure: true,
        sameSite: "strict"
      })
      
      // Redirigimos a la página principal después de iniciar sesión
      navigate("/mainpage");

    } catch (error) {
      console.error("Error en el login:", error);
      setErrorMessage("Hubo un problema con la conexión al servidor");
    }
  };

  return (
    <div className="login-wrapper">
      <header className="login-header">
        <img src={logo} alt="Logo" className="login-logo" />
      </header>

      <main className="login-content">
        <h1 className="login-title">Iniciar sessió</h1>
        <p className="login-subtitle">
          Introdueix el teu correu electrònic i contrasenya per iniciar sessió
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="username"
            placeholder="email@domain.com"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contrasenya"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-primary">Iniciar sessió</button>
        </form>

        {message && <div className="login-message">{message}</div>}
        {errorMessage && <div className="login-error">{errorMessage}</div>}

        <div className="login-links">
          <a onClick={() => navigate("/psswdrecov")}>Has oblidat la teva contrasenya?</a>
          <a onClick={() => navigate("/register")}>Crea un compte</a>
        </div>
      </main>
    </div>
  );
}

export default Login;
