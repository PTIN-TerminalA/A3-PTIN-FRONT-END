import React, { useState } from "react";
import logo from "/src/pages/images/LogoBlanco.png";
import "./css/register.css";

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {
      passwordMatch: true,
      isAdult: true,
      dniFormat: true,
      requiredFields: true,
    };

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

    if (formData.password !== formData.confirmPassword) {
      valid = false;
      newErrors.passwordMatch = false;
    }

    if (formData.birthDate) {
      const cutoffDate = new Date('2025-04-04');
      const birthDate = new Date(formData.birthDate);
      let age = cutoffDate.getFullYear() - birthDate.getFullYear();
      const monthDiff = cutoffDate.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && cutoffDate.getDate() < birthDate.getDate())) age--;
      if (age < 18) {
        valid = false;
        newErrors.isAdult = false;
      }
    }

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
    }
  };

  return (
    <div className="register-wrapper">
      <header className="register-header">
        <img src={logo} alt="Logo" className="register-logo" />
      </header>

      <h1 className="register-title">Registre de Nou Usuari</h1>
      {successMessage && <div className="success-message">{successMessage}</div>}

      <form className="register-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Nom</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
          {!errors.requiredFields && !formData.firstName.trim() && <span className="error">Camp obligatori</span>}
        </div>

        <div className="input-group">
          <label>Cognom</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
          {!errors.requiredFields && !formData.lastName.trim() && <span className="error">Camp obligatori</span>}
        </div>

        <div className="input-group">
          <label>Segon cognom</label>
          <input type="text" name="secondLastName" value={formData.secondLastName} onChange={handleChange} />
          {!errors.requiredFields && !formData.secondLastName.trim() && <span className="error">Camp obligatori</span>}
        </div>

        <div className="input-group">
          <label>DNI</label>
          <input type="text" name="dni" value={formData.dni} onChange={handleChange} />
          {!errors.dniFormat && <span className="error">Format invàlid</span>}
        </div>

        <div className="input-group full-width">
          <label>Correu electrònic</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>

        <div className="input-group full-width">
          <label>Número de telèfon</label>
          <div className="phone-wrapper">
            <select name="prefix" value={formData.prefix} onChange={handleChange} className="prefix-select">
              {countryCodes.map((country) => (
                <option key={country.code} value={country.code}>{country.code} ({country.name})</option>
              ))}
            </select>
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          </div>
        </div>

        <div className="input-group">
          <label>Gènere</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Selecciona...</option>
            <option value="male">Home</option>
            <option value="female">Dona</option>
            <option value="other">Altres</option>
          </select>
        </div>

        <div className="input-group">
          <label>Data de naixement</label>
          <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
        </div>

        <div className="input-group full-width">
          <label>Contrasenya</label>
          <div className="password-wrapper">
            <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="show-hide-button">
              {showPassword ? "Amagar" : "Mostrar"}
            </button>
          </div>
        </div>

        <div className="input-group full-width">
          <label>Confirmació contrasenya</label>
          <div className="password-wrapper">
            <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="show-hide-button">
              {showConfirmPassword ? "Amagar" : "Mostrar"}
            </button>
          </div>
        </div>

        <button type="submit" className="register-button">Registrar-se</button>
        <button type="button" onClick={() => window.history.back()} className="register-button">Tornar enrere</button>
      </form>
    </div>
  );
}

export default Register;
