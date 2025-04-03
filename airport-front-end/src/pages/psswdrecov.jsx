import React, { useState } from "react";
import logo from "./logo.png"; // Ruta al logo que guardaste en src/pages

function PasswordRecovery() {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí deberías manejar la lógica de la recuperación de contraseña (por ejemplo, API call)
    // En este ejemplo, simplemente mostramos el mensaje de éxito
    setMessage(`T'hem enviat un correu a ${formData.email} per reestablir la teva contrasenya.`);
  };

  return (
    <div style={styles.container}>
      {/* Franja superior */}
      <div style={styles.header}>
        <img src={logo} alt="Logo" style={styles.logo} />
      </div>

      {/* Título debajo de la franja */}
      <h2 style={styles.title}>Recuperació de Contrasenya</h2>
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
        </div>

        {/* Botón Recuperar Contraseña */}
        <button type="submit" style={styles.button}>Recuperar contrasenya</button>
      </form>

      {/* Mensaje de confirmación */}
      {message && <div style={styles.message}>{message}</div>}

      {/* Botón Tornar enrere */}
      <button type="button" onClick={() => window.history.back()} style={styles.button}>
        Tornar enrere
      </button>
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
  header: {
    width: "100%",
    height: "120px", // Hice la franja superior aún más grande
    backgroundColor: "#023047", // Color de la franja superior
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: "30px", // Aumenté el padding izquierdo
    position: "absolute", // Hace que la franja esté en la parte superior de la página
    top: "0",
    left: "0",
  },
  logo: {
    width: "120px", // Aumenté el tamaño del logo
    height: "auto",
  },
  title: {
    marginTop: "150px", // Ajusté el margen superior para que el título esté correctamente ubicado
    fontSize: "34px", // Aumenté el tamaño del título
    fontWeight: "bold",
    color: "#023047", // Color de texto similar al de la franja
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "35px", // Aumento el espacio entre los campos
    width: "400px", // Aumento el tamaño del formulario
    padding: "30px", // Aumento el padding del formulario
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)", // Sombra más prominente
    borderRadius: "12px", // Redondeo más pronunciado
    backgroundColor: "#fff",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontWeight: "bold",
    color: "#023047", // Mantener la coherencia con el tema de color
    fontSize: "20px", // Aumento el tamaño de la fuente de las etiquetas
  },
  input: {
    padding: "16px", // Aumento el tamaño del campo
    fontSize: "18px", // Aumento el tamaño de la fuente del campo
    marginTop: "10px",
    borderRadius: "8px", // Hago las esquinas más redondeadas
    border: "1px solid #ddd",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Sombra más prominente en los campos
  },
  button: {
    padding: "18px 30px", // Aumento el tamaño del botón
    backgroundColor: "#219EBC",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "20px", // Aumento el tamaño de la fuente del botón
    marginTop: "20px", // Aumento el margen superior para más separación
  },
  message: {
    marginTop: "30px",
    padding: "18px",
    backgroundColor: "#e0f7fa",
    color: "#00796b",
    borderRadius: "8px",
    fontSize: "20px", // Aumento el tamaño del mensaje
    textAlign: "center",
  },
};

export default PasswordRecovery;
