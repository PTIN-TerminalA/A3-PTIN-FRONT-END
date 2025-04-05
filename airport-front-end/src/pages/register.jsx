import React, { useState } from "react";
import logo from "/src/logo.jpeg";
import "./register.css";

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
    prefix: "+34",
  });

  const [errors, setErrors] = useState({
    passwordMatch: true,
    isAdult: true,
    dniFormat: true,
    requiredFields: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const countryCodes = [
    { name: "España", code: "+34" },
    { name: "Andorra", code: "+376" },
    { name: "Francia", code: "+33" },
    { name: "Portugal", code: "+351" },
    { name: "Alemania", code: "+49" },
    { name: "Italia", code: "+39" },
    { name: "Reino Unido", code: "+44" },
    { name: "EEUU", code: "+1" },
    { name: "México", code: "+52" },
    { name: "Argentina", code: "+54" },
    { name: "Colombia", code: "+57" },
    { name: "Chile", code: "+56" },
    { name: "Perú", code: "+51" },
    { name: "Brasil", code: "+55" },
    { name: "China", code: "+86" },
    { name: "Japón", code: "+81" },
    { name: "India", code: "+91" },
    { name: "Rusia", code: "+7" },
    { name: "Australia", code: "+61" },
    { name: "Sudáfrica", code: "+27" },
    { name: "Nigeria", code: "+234" },
    { name: "Marruecos", code: "+212" },
    { name: "Argelia", code: "+213" },
    { name: "Egipto", code: "+20" },
    { name: "Catar", code: "+974" },
    { name: "Emiratos Árabes", code: "+971" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {
      passwordMatch: true,
      isAdult: true,
      dniFormat: true,
      requiredFields: true,
    };

    // Validar campos requeridos
    const requiredFields = [
      'firstName', 'lastName', 'secondLastName', 'dni',
      'email', 'phoneNumber', 'gender', 'birthDate',
      'password', 'confirmPassword'
    ];
    
    const hasEmptyFields = requiredFields.some(field => !formData[field].trim());
    if (hasEmptyFields) {
      valid = false;
      newErrors.requiredFields = false;
    }

    // Validar contraseñas
    if (formData.password !== formData.confirmPassword) {
      valid = false;
      newErrors.passwordMatch = false;
    }

    // Validar edad (4 de abril de 2025)
    if (formData.birthDate) {
      const cutoffDate = new Date('2025-04-04');
      const birthDate = new Date(formData.birthDate);
      let age = cutoffDate.getFullYear() - birthDate.getFullYear();
      const monthDiff = cutoffDate.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && cutoffDate.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 18) {
        valid = false;
        newErrors.isAdult = false;
      }
    }

    // Validar DNI
    const dniPattern = /^\d{8}[A-Za-z]$/;
    if (!dniPattern.test(formData.dni)) {
      valid = false;
      newErrors.dniFormat = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage("");
    
    if (validateForm()) {
      setSuccessMessage("Registre completat amb èxit!");
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
      <div style={styles.header}>
        <img src={logo} alt="Logo" className = "logo" />
      </div>

      <h2 style={styles.title}>Registre de Nou Usuari</h2>
      
      {successMessage && <div style={styles.successMessage}>{successMessage}</div>}

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
          {!errors.requiredFields && !formData.firstName.trim() && (
            <span style={styles.error}>Aquest camp és obligatori</span>
          )}
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
          {!errors.requiredFields && !formData.lastName.trim() && (
            <span style={styles.error}>Aquest camp és obligatori</span>
          )}
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
          {!errors.requiredFields && !formData.secondLastName.trim() && (
            <span style={styles.error}>Aquest camp és obligatori</span>
          )}
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
          {!errors.requiredFields && !formData.dni.trim() && (
            <span style={styles.error}>Aquest camp és obligatori</span>
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
          {!errors.requiredFields && !formData.email.trim() && (
            <span style={styles.error}>Aquest camp és obligatori</span>
          )}
        </div>

        {/* Telèfon */}
        <div style={styles.inputGroup}>
          <label htmlFor="phoneNumber" style={styles.label}>Número de telèfon</label>
          <div style={styles.phoneWrapper}>
            <select
              name="prefix"
              value={formData.prefix}
              onChange={handleChange}
              style={styles.prefixSelect}
            >
              {countryCodes.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.code} ({country.name})
                </option>
              ))}
            </select>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="123456789"
              style={{ ...styles.input, flex: 1 }}
            />
          </div>
          {!errors.requiredFields && !formData.phoneNumber.trim() && (
            <span style={styles.error}>Aquest camp és obligatori</span>
          )}
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
          {!errors.requiredFields && !formData.gender.trim() && (
            <span style={styles.error}>Aquest camp és obligatori</span>
          )}
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
          {!errors.requiredFields && !formData.birthDate.trim() && (
            <span style={styles.error}>Aquest camp és obligatori</span>
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
          {!errors.requiredFields && !formData.password.trim() && (
            <span style={styles.error}>Aquest camp és obligatori</span>
          )}
        </div>

        {/* Confirmació contrasenya */}
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
          {!errors.requiredFields && !formData.confirmPassword.trim() && (
            <span style={styles.error}>Aquest camp és obligatori</span>
          )}
        </div>

        <button type="submit" style={styles.button}>Registrar-se</button>
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
    position: "relative",
    margin: 0,
    padding: 0,
    width: "100%",
    overflowX: "hidden",
  },
  header: {
    width: "100vw",
    height: "120px",
    backgroundColor: "#023047",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: "30px",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    boxSizing: "border-box",
  },
  logo: {
    width: "120px",
    height: "auto",
  },
  title: {
    marginTop: "150px",
    fontSize: "24px",
    color: "#023047",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "300px",
    marginTop: "40px",
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
  phoneWrapper: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  prefixSelect: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    backgroundColor: "white",
    fontSize: "14px",
    width: "140px",
  },
  successMessage: {
    color: "#2ecc71",
    fontSize: "16px",
    marginBottom: "15px",
    fontWeight: "bold",
  },
};

export default Register;