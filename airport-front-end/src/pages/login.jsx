import React, { useState } from "react";
import logo from "/src/pages/images/LogoBlanco.png";
import googleIcon from "/src/pages/images/google.png"
import "./css/login.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode" 
import { useGoogleLogin } from "@react-oauth/google";

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
      const response = await fetch("http://192.168.10.10:8000/api/login", {
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

    const handleGoogleLogin = async (userData) => {
        try{
            //const userData = jwtDecode(credentialResponse.credential)
  
            const registerRes = await fetch("http://192.168.10.10:8000/api/register-login-google", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: userData.name,
                dni: "00000000X",
                email: userData.email,
                password: generateRandomPassword(),
                usertype: 1
              }),
            });
  
            if (!registerRes.ok) {
              const responseData = await registerRes.json();
              throw new Error(responseData.detail || "Error en el registro");
            }
  
            const registerData = await registerRes.json();
            Cookies.set("token", registerData.access_token,{
              expires: 1,
            //para https -> secure: true,
              sameSite: "strict"
            })
  
            if (registerData.needs_regular){
              navigate("/regularInfoForm")
            }
            else{
              navigate("/mainpage")
            }
        } 
        
        catch(err) {
          console.error("Error amb el login de Google", err.message)
        }
    }

 const loginGoogle = useGoogleLogin({
     onSuccess: async (tokenResponse) => {
       // Usas el token para pedir los datos del usuario
       const userInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
         headers: {
           Authorization: `Bearer ${tokenResponse.access_token}`,
         },
       }).then(res => res.json());
   
       // Ahora tienes name, email, etc.
       console.log("User Info", userInfo);
   
       // Aquí haces tu registro o login en el backend
       await handleGoogleLogin(userInfo);
     },
     onError: () => console.log("Login failed"),
   });
        
  
    // Función para generar una contraseña aleatoria
    function generateRandomPassword() {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?";
      let password = "";
      for (let i = 0; i < 12; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return password;
    }

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

        <div className="login-links">
          <a onClick={() => navigate("/psswdrecov")}>Has oblidat la teva contrasenya?</a>
        </div>

        <div className="login-divider">
          <hr />
          <span>o</span>
          <hr />
        </div>

        {message && <div className="login-message">{message}</div>}
        {errorMessage && <div className="login-error">{errorMessage}</div>}

      </main>
      <div className="googleDiv">
        <button className="google-custom-button" onClick={() => loginGoogle()}>
          <img src={googleIcon} alt="Google" className="google-icon" />
          <span>Continua amb Google</span>
        </button> 
      </div>
      <p className="login-terms">
        En fer clic a iniciar sessió acceptes les nostres <strong>Condicions del servei</strong> i la <strong>Política de privadesa</strong>
      </p>  

      <div className="login-links">
        <a onClick={() => navigate("/register")}>Crea un compte</a>
      </div>
    </div>
  );
}

export default Login;
