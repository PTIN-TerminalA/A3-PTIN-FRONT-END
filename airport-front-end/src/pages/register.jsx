import React, { useState } from "react";
import logo from "/src/pages/images/LogoBlanco.png";
import googleIcon from "/src/pages/images/google.png"
import "./css/register.css";
import Cookies from "js-cookie"
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode" 
import { useGoogleLogin } from '@react-oauth/google';


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
      passwordStrength: true,
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

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;,.<>?/-]).{8,}$/;
    if (!passwordPattern.test(formData.password)) {
      valid = false;
      newErrors.passwordStrength = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    if (validateForm()) {
  
      try {

        const fullName = `${formData.firstName} ${formData.lastName} ${formData.secondLastName}`;

        const registerRes = await fetch("http://localhost:8000/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: fullName,
            dni: formData.dni,
            email: formData.email,
            password: formData.password,
            usertype: 1
          }),
        });
        

        if (!registerRes.ok) {
          const responseData = await registerRes.json();
          throw new Error(responseData.detail || "Error en el registro");
        }

        const registerData = await registerRes.json();
        const token = registerData.access_token;

        const regularRes = await fetch("http://localhost:8000/api/register-regular", {
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

        if (!regularRes.ok){
          const errorData = await regularRes.json();
          throw new Error(errorData.detail || "Error al registrar regular")
        }

        Cookies.set("token", token,{
          expires: 1,
         //para https -> secure: true,
          sameSite: "strict"
        })
          
        setSuccessMessage("Registre completat amb èxit!");

        navigate("/mainpage")

      } catch (error) {
        console.error("Error en el registro:", error.message);
        setSuccessMessage(error.message)
      }
      
      console.log("Form submitted", formData);
    }
  };
  





  const handleGoogleLogin = async (userData) => {
      try{
          //const userData = jwtDecode(credentialResponse.credential)

          const registerRes = await fetch("http://localhost:8000/api/register-login-google", {
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
    <div className="register-wrapper">
      <header className="register-header">
        <img src={logo} alt="Logo" className="register-logo" />
      </header>

      <h1 className="register-title">Benvingut a Flysy!</h1>
      <h2 className="register-subtitle">Registrat</h2>
      <p className="register-text">
        Introdueix les teves dades i crea una contrasenya per registrar-te
      </p>
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
            <input className="input-numero" type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          </div>
        </div>

        <div className="input-group">
          <label>Gènere</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Selecciona...</option>
            <option value="male">Home</option>
            <option value="female">Dona</option>
            <option value="other">Altres</option>
            <option value="rather_not_to_say">Prefereixo no dir-ho</option>
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
          {!errors.passwordStrength && <span className="error">La contrasenya ha de tenir mínim 8 caràcteres, una mayúscula, una minúscula, un número y un símbol</span>}
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

      <div className="register-divider">
        <hr className="register-linea"/>
        <span>o</span>
        <hr className="register-linea"/>
      </div>

      <div className="googleDiv">
        <button className="google-custom-button" onClick={() => loginGoogle()}>
          <img src={googleIcon} alt="Google" className="google-icon" />
          <span>Continua amb Google</span>
        </button> 
      </div>
      <p className="login-terms">
        En fer clic a iniciar sessió acceptes les nostres <strong>Condicions del servei</strong> i la <strong>Política de privadesa</strong>
      </p>      
    </div>
  );
}

export default Register;
