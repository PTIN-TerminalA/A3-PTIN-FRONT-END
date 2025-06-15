import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "/src/pages/images/LogoBlanco.png";
import "./css/login.css";

function PasswordReset() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;,.<>?/-]).{8,}$/;
    if (!passwordPattern.test(newPassword)) {
      setError(
        "La contrasenya ha de tenir almenys 8 caràcters, una majúscula, una minúscula, un número i un símbol."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les contrasenyes no coincideixen.");
      return;
    }

    const formData = new FormData();
    formData.append("token", token);
    formData.append("new_password", newPassword);

    try {
      const response = await fetch("http://192.168.10.10:8000/api/recovery/reset", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Contrasenya canviada correctament. Ara pots iniciar sessió.");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(data.detail || "Error inesperat.");
      }
    } catch (err) {
      setError("Error de connexió amb el servidor.");
    }
  };

  return (
    <div className="login-wrapper">
      <header className="login-header">
        <img src={logo} alt="Logo" className="login-logo" />
      </header>

      <main className="login-content">
        <h1 className="login-title">Canvi de contrasenya</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nova contrasenya"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn-primary"
              style={{ padding: "0.3rem", marginTop: "0.3rem" }}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Amagar" : "Mostrar"}
            </button>
          </div>

          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Repeteix la nova contrasenya"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn-primary"
              style={{ padding: "0.3rem", marginTop: "0.3rem" }}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? "Amagar" : "Mostrar"}
            </button>
          </div>

          <button type="submit" className="btn-primary">Actualitzar</button>
        </form>

        {message && <div className="login-message">{message}</div>}
        {error && <div className="login-message" style={{ backgroundColor: "#ffdddd", color: "#a94442" }}>{error}</div>}
      </main>
    </div>
  );
}

export default PasswordReset;

