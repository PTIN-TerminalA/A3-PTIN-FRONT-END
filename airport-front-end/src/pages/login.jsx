import React, { useState } from "react";
import logo from "./logo.png"; // Ruta al logo que guardaste en src/pages

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí deberías manejar el inicio de sesión (validación o API call)
    console.log("Iniciando sesión", formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    // Redirigir a la página de recuperación de contraseña
    console.log("Redirigiendo a la página de recuperación de contraseña");
  };

  return (
    <div style={styles.container}>
      {/* Logo aquí */}
      <div style={styles.logoContainer}>
        <img src={logo} alt="Logo" style={styles.logo} />
      </div>

      <h2>Inici de Sessió</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Correu electrònic */}
        <div style={styles.inputGroup}>
          <label htmlFor="email" style={styles.label}>Correu electrònic</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Ex: joan@exemple.com"
            style={styles.input}
          />
        </div>

        {/* Contrasenya */}
        <div style={styles.inputGroup}>
          <label htmlFor="password" style={styles.label}>Contrasenya</label>
          <div style={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ex: ********"
              style={styles.input}
            />
            <button type="button" onClick={togglePasswordVisibility} style={styles.showHideButton}>
              {showPassword ? "Amagar" : "Mostrar"}
            </button>
          </div>
        </div>

        {/* Botón Iniciar sesión */}
        <button type="submit" style={styles.button}>Iniciar sessió</button>

        {/* Enlace de recuperar la contraseña */}
        <div style={styles.linkContainer}>
          <a href="#" onClick={handleForgotPassword} style={styles.link}>Has oblidat la teva contrasenya?</a>
        </div>

        {/* Botón Registrar */}
        <div style={styles.linkContainer}>
          <button
            type="button"
            onClick={() => window.location.href = "/register"} // Redirige a la página de registro
            style={styles.linkButton}
          >
            Registra't
          </button>
        </div>

        {/* Botón Tornar enrere */}
        <button type="button" onClick={() => window.history.back()} style={styles.button}>
          Tornar enrere
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f9f9f9",
    flexDirection: "column",
    fontFamily: "'Roboto', sans-serif",
  },
  logoContainer: {
    marginBottom: "20px", // Espacio debajo del logo
  },
  logo: {
    width: "150px", // Ajusta el tamaño del logo según sea necesario
    height: "auto",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "300px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontWeight: "bold",
  },
  input: {
    padding: "10px",
    marginTop: "5px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#219EBC",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
  },
  showHideButton: {
    background: "none",
    border: "none",
    color: "#219EBC",
    cursor: "pointer",
    fontSize: "14px",
    marginLeft: "5px",
  },
  linkContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  link: {
    color: "#219EBC",
    textDecoration: "none",
    fontSize: "14px",
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "#219EBC",
    cursor: "pointer",
    fontSize: "14px",
  },
  passwordWrapper: {
    display: "flex",
    alignItems: "center",
  },
};

export default Login;
