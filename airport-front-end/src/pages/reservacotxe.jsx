// src/pages/reservacotxe.jsx

import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import LogOutButton from "/src/components/LogOutButton.jsx";
import perfil from "/src/pages/images/perfil.png";
import "./css/reservacotxe.css";
import logo from "../pages/images/LogoBlanco.png";
import mapa from "../pages/images/Plano.png";
import IndoorMap from "/src/components/MapaLeafletRutaReserva.jsx";


function ReservaCotxe() {
  const navigate = useNavigate();
  const [tipusReserva, setTipusReserva] = useState("instant");
  const [puntRecollida, setPuntRecollida] = useState("");
  const [destinacio, setDestinacio] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");

  const ubicacions = [
    "Porta A3",
    "Pàrquing",
    "McDonald's",
    "Starbucks",
    "Porta A2",
    "Serveis 1",
    "FCB Store",
    "Farmàcia",
    "Porta A1",
    "Punt Info. 2",
    "H&M",
    "Cafè",
    "Serveis 2",
    "Porta A4",
    "VIP A4",
    "Reclamació equipatge",
    "Control Seguretat",
    "Punt Info. 1",
    "Zona Check-in",
    "Levi's",
    "Parada Taxi"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");
    const now = new Date().toISOString();
    const scheduled = tipusReserva === "programada" ? `${data}T${hora}` : now;

    const reserva = {
      start_location: puntRecollida,
      end_location: destinacio,
      vehicle_id: "c1",    // placeholder
      scheduled_time: scheduled,
      state: tipusReserva === "programada" ? "Programada" : "En curs"
    };

    try {
      const res = await fetch("http://localhost:8000/reserves/usuari", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(reserva)
      });

      if (res.ok) {
        alert("Reserva confirmada amb èxit!");
      } else {
        const err = await res.json();
        alert("Error en la reserva: " + (err.detail || res.statusText));
      }
    } catch (err) {
      alert("Error en el servidor: " + err.message);
    }
  };

  return (
    <div className="reservacotxe-wrapper">
      <header className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Logo" className="navbar-logo" />
        </div>
        <div className="navbar-center">
          <a href="/">Inici</a>
          <a href="#vols">Vols</a>
          <a href="#serveis">Serveis</a>
          <a href="#contacte">Contacte</a>
        </div>
        <div className="navbar-right-reservas">
          <button class="reservas-perfil-button" onClick={() => window.location.href = "/AdminProfile"}>
            <img src={perfil} alt="Perfil" />
          </button>
          <LogOutButton></LogOutButton>
        </div>
      </header>

      <div className="main-content-container">
        <div className="background-image-layer"></div>
        
        <div className="reserva-main-container">
          <div className="reserva-form-container">
            <div className="reserva-section">
              <h1 className="section-title">Reserva de Vehicle</h1>
              <p className="section-description-reserva">
                Selecciona el tipus de reserva i introdueix la informació necessària per fer la teva sol·licitud.
              </p>

              <div className="reserva-selector">
                <button
                  className={tipusReserva === "instant" ? "reserva-btn active" : "reserva-btn"}
                  onClick={() => setTipusReserva("instant")}
                >
                  Reserva Instantània
                </button>
                <button
                  className={tipusReserva === "programada" ? "reserva-btn active" : "reserva-btn"}
                  onClick={() => setTipusReserva("programada")}
                >
                  Reserva Programada
                </button>
              </div>

              <form className="reserva-form" onSubmit={handleSubmit}>
                <label>
                  Punt de Recollida:
                  <select
                    value={puntRecollida}
                    onChange={e => setPuntRecollida(e.target.value)}
                    required
                    className="ubicacio-select"
                  >
                    <option value="">Selecciona una ubicació</option>
                    {ubicacions.map((u, i) => (
                      <option key={i} value={u}>{u}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Destinació:
                  <select
                    value={destinacio}
                    onChange={e => setDestinacio(e.target.value)}
                    required
                    className="ubicacio-select"
                  >
                    <option value="">Selecciona una ubicació</option>
                    {ubicacions.map((u, i) => (
                      <option key={i} value={u}>{u}</option>
                    ))}
                  </select>
                </label>

                {tipusReserva === "programada" && (
                  <>
                    <label>
                      Data:
                      <input
                        type="date"
                        value={data}
                        onChange={e => setData(e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      Hora:
                      <input
                        type="time"
                        value={hora}
                        onChange={e => setHora(e.target.value)}
                        required
                      />
                    </label>
                  </>
                )}

                <button type="submit" className="btn btn-filled reservar-btn">
                  Confirmar Reserva
                </button>
              </form>
            </div>
          </div>

          <div className="mapa-container">
            <div className="mapa-wrapper">
              <IndoorMap startLocation={[0.5015634772, 0.3986866792]} endLocation={[0.5109443402, 0.3367729831]} />
            </div>
          </div>
        </div>
      </div>

      <footer className="main-footer lowered-footer"> 
        <div className="footer-columns">
          <div className="footer-col">
            <h4>Serveis</h4>
            <ul>
              <li>Informació de vols</li>
              <li>Botigues i restauració</li>
              <li>Transport</li>
              <li>Accessibilitat</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Xarxes Socials</h4>
            <div className="social-icons">
              <span className="icon-placeholder">F</span>
              <span className="icon-placeholder">G+</span>
              <span className="icon-placeholder">T</span>
              <span className="icon-placeholder">Y</span>
            </div>
          </div>
          <div className="footer-col">
            <h4>Contacte</h4>
            <p>Necessites ajuda? Truca'ns ara</p>
            <p className="footer-phone">+34 600 000 000</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ReservaCotxe;
