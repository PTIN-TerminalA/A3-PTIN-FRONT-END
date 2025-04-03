import React, { useState } from "react";
import logo from "./logo.png"; // Ruta al logo que guardaste en src/pages

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    secondLastName: "",
    dni: "",
    email: "",
    phoneNumber: "",
    gender: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
    prefix: "+34", // Prefijo de teléfono por defecto
  });

  const [errors, setErrors] = useState({
    passwordMatch: true,
    isAdult: true,
    dniFormat: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let valid = true;
    let errors = {};

    if (formData.password !== formData.confirmPassword) {
      valid = false;
      errors.passwordMatch = false;
    }

    const birthDate = new Date(formData.birthDate);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      valid = false;
      errors.isAdult = false;
    }

    const dniPattern = /^\d{8}[A-Za-z]$/;
    if (!dniPattern.test(formData.dni)) {
      valid = false;
      errors.dniFormat = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted", formData);
    } else {
      console.log("Form validation failed");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div style={styles.container}>
      {/* Logo aquí */}
      <div style={styles.logoContainer}>
        <img src={logo} alt="Logo" style={styles.logo} />
      </div>

      <h2>Registre de Nou Usuari</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Nombre */}
        <div style={styles.inputGroup}>
          <label htmlFor="firstName" style={styles.label}>Nom</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Ex: Joan"
            style={styles.input}
          />
        </div>

        {/* Primer apellido */}
        <div style={styles.inputGroup}>
          <label htmlFor="lastName" style={styles.label}>Cognom</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Ex: Garcia"
            style={styles.input}
          />
        </div>

        {/* Segundo apellido */}
        <div style={styles.inputGroup}>
          <label htmlFor="secondLastName" style={styles.label}>Segon cognom</label>
          <input
            type="text"
            id="secondLastName"
            name="secondLastName"
            value={formData.secondLastName}
            onChange={handleChange}
            placeholder="Ex: Lopez"
            style={styles.input}
          />
        </div>

        {/* DNI */}
        <div style={styles.inputGroup}>
          <label htmlFor="dni" style={styles.label}>DNI</label>
          <input
            type="text"
            id="dni"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            placeholder="Ex: 12345678A"
            style={styles.input}
          />
          {!errors.dniFormat && (
            <span style={styles.error}>El DNI ha de tenir el format 8 números seguit d'una lletra</span>
          )}
        </div>

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

        {/* Número de telèfon */}
        <div style={styles.inputGroup}>
          <label htmlFor="phoneNumber" style={styles.label}>Número de telèfon</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Ex: 123456789"
            style={styles.input}
          />
        </div>

        {/* Gènere */}
        <div style={styles.inputGroup}>
          <label htmlFor="gender" style={styles.label}>Gènere</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Selecciona...</option>
            <option value="male">Home</option>
            <option value="female">Dona</option>
            <option value="other">Altres</option>
          </select>
        </div>

        {/* Data de naixement */}
        <div style={styles.inputGroup}>
          <label htmlFor="birthDate" style={styles.label}>Data de naixement</label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            style={styles.input}
          />
          {!errors.isAdult && (
            <span style={styles.error}>Has de ser major d'edat per registrar-te</span>
          )}
        </div>

        {/* Contrassenya */}
        <div style={styles.inputGroup}>
          <label htmlFor="password" style={styles.label}>Contrasenya</label>
          <div style={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
            />
            <button type="button" onClick={togglePasswordVisibility} style={styles.showHideButton}>
              {showPassword ? "Amagar" : "Mostrar"}
            </button>
          </div>
        </div>

        {/* Confirmació de la contrassenya */}
        <div style={styles.inputGroup}>
          <label htmlFor="confirmPassword" style={styles.label}>Confirmació de la contrassenya</label>
          <div style={styles.passwordWrapper}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input}
            />
            <button type="button" onClick={toggleConfirmPasswordVisibility} style={styles.showHideButton}>
              {showConfirmPassword ? "Amagar" : "Mostrar"}
            </button>
          </div>
          {!errors.passwordMatch && (
            <span style={styles.error}>Les contrasenyes no coincideixen</span>
          )}
        </div>

        {/* Botón Registrar */}
        <button type="submit" style={styles.button}>Registrar-se</button>

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
  error: {
    color: "red",
    fontSize: "12px",
  },
  passwordWrapper: {
    display: "flex",
    alignItems: "center",
  },
};

export default Register;
