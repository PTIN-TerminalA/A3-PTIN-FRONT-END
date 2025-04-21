// CreateUser.jsx
import React, { useState } from "react";
import logo from "/src/pages/images/LogoBlanco.png";  // Ruta de tu logo
import "./css/register.css";  // Usa el mismo estilo si quieres, puedes modificarlo
import { useNavigate } from "react-router-dom";
import "./css/createUser.css";
function createUser() {
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
    requiredFields: true,
    dniFormat: true,
    passwordStrength: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {
      passwordMatch: true,
      requiredFields: true,
      dniFormat: true,
      passwordStrength: true,
    };

    // Validar campos obligatorios
    const requiredFields = [
      "firstName", "lastName", "secondLastName", "dni",
      "email", "phoneNumber", "gender", "birthDate",
      "password", "confirmPassword"
    ];

    const hasEmptyFields = requiredFields.some(field => !formData[field].trim());
    if (hasEmptyFields) {
      valid = false;
      newErrors.requiredFields = false;
    }

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      valid = false;
      newErrors.passwordMatch = false;
    }

    // Validar el formato del DNI (suponiendo que es una validación básica)
    const dniPattern = /^\d{8}[A-Za-z]$/;
    if (!dniPattern.test(formData.dni)) {
      valid = false;
      newErrors.dniFormat = false;
    }

    // Validar la fortaleza de la contraseña
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;,.<>?/-]).{8,}$/;
    if (!passwordPattern.test(formData.password)) {
      valid = false;
      newErrors.passwordStrength = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Aquí puedes manejar los datos del formulario (por ejemplo, mostrar un mensaje de éxito)
      console.log("Formulario enviado", formData);
      // Redirigir a otra página o mostrar un mensaje de éxito
      navigate("/mainpage"); // O cualquier otra página después de la creación
    }
  };

  return (
    <div className="register-wrapper">
      <header className="register-header">
        <img src={logo} alt="Logo" className="register-logo" />
      </header>

      <h1 className="register-title">Crear Nou Usuari</h1>

      <form className="register-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Nom</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          {!errors.requiredFields && !formData.firstName.trim() && <span className="error">Camp obligatori</span>}
        </div>

        <div className="input-group">
          <label>Cognom</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          {!errors.requiredFields && !formData.lastName.trim() && <span className="error">Camp obligatori</span>}
        </div>

        <div className="input-group">
          <label>Segon cognom</label>
          <input
            type="text"
            name="secondLastName"
            value={formData.secondLastName}
            onChange={handleChange}
          />
          {!errors.requiredFields && !formData.secondLastName.trim() && <span className="error">Camp obligatori</span>}
        </div>

        <div className="input-group">
          <label>DNI</label>
          <input
            type="text"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
          />
          {!errors.dniFormat && <span className="error">Format invàlid</span>}
        </div>

        <div className="input-group full-width">
          <label>Correu electrònic</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="input-group full-width">
          <label>Número de telèfon</label>
          <div className="phone-wrapper">
            <select
              name="prefix"
              value={formData.prefix}
              onChange={handleChange}
              className="prefix-select"
            >
              {/* Puedes añadir más códigos de país si lo necesitas */}
              <option value="+34">+34 (Espanya)</option>
            </select>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="input-group">
          <label>Gènere</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Selecciona...</option>
            <option value="male">Home</option>
            <option value="female">Dona</option>
            <option value="other">Altres</option>
            <option value="rather_not_to_say">Prefereixo no dir-ho</option>
          </select>
        </div>

        <div className="input-group">
          <label>Data de naixement</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
          />
        </div>

        <div className="input-group full-width">
          <label>Contrasenya</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="show-hide-button"
            >
              {showPassword ? "Amagar" : "Mostrar"}
            </button>
          </div>
          {!errors.passwordStrength && (
            <span className="error">
              La contrasenya ha de tenir mínim 8 caràcters, una mayúscula, una
              minúscula, un número i un símbol.
            </span>
          )}
        </div>

        <div className="input-group full-width">
          <label>Confirmació contrasenya</label>
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="show-hide-button"
            >
              {showConfirmPassword ? "Amagar" : "Mostrar"}
            </button>
          </div>
        </div>

        <button type="submit" className="register-button">Crear Usuari</button>
        <button type="button" onClick={() => window.history.back()} className="register-button">Tornar enrere</button>
      </form>
    </div>
  );
}

export default createUser;
