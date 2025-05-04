import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function RegularInfoForm() {
  const [formData, setFormData] = useState({
    dni: "",
    phoneNumber: "",
    gender: "",
    birthDate: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Token no disponible");

      const response = await fetch("http://localhost:8000/api/register-regular", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          birth_date: formData.birthDate,
          phone_num: formData.phoneNumber,
          identity: formData.gender,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al completar el registre");
      }

      const response2 = await fetch("http://localhost:8000/api/update-dni",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            access_token: token,
            dni: formData.dni,
        }),
      });


      navigate("/mainpage");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-wrapper">
      <h2>Completa les teves dades</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="register-form">
        <div className="input-group">
          <label>DNI</label>
          <input type="text" name="dni" value={formData.dni} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Telèfon</label>
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Gènere</label>
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Selecciona...</option>
            <option value="male">Home</option>
            <option value="female">Dona</option>
            <option value="other">Altres</option>
            <option value="rather_not_to_say">Prefereixo no dir-ho</option>
          </select>
        </div>
        <div className="input-group">
          <label>Data de naixement</label>
          <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
        </div>
        <button type="submit" className="register-button">Finalitzar registre</button>
      </form>
    </div>
  );
}

export default RegularInfoForm;
