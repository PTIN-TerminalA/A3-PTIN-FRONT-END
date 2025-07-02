// src/pages/reservacotxe.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import LogOutButton from "/src/components/LogOutButton.jsx";
import perfil from "/src/pages/images/perfil.png";
import "./css/reservacotxe.css";
import logo from "../pages/images/LogoBlanco.png";
import mapa from "../pages/images/Plano.png";
import IndoorMap from "/src/components/MapaLeafletRutaReserva.jsx";
import BackButton from "/src/components/BackButton.jsx";

const _apiUrl = "https://flysy.software" 

function ReservaCotxe() {
  const navigate = useNavigate();
  const [tipusReserva, setTipusReserva] = useState("instant");
  const [puntRecollida, setPuntRecollida] = useState("");
  const [destinacio, setDestinacio] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [ubicacions, setUbicacions] = useState([]);
  const [showReservas, setShowReservas] = useState(false);
  const [misReservas, setMisReservas] = useState([]);
  const [valoracions, setValoracions] = useState({}); // { idx: { rating, comment } }
  const [loadingReservas, setLoadingReservas] = useState(false);

  useEffect(() => {
    fetch(`${_apiUrl}/api/services`)
      .then((response) => response.json())
      .then((data) => {
        setUbicacions(data.map((service) => service.name));
      })
      .catch((error) => console.error("Error fetching ubicacions:", error));
  }, []);

  useEffect(() => {
    if (puntRecollida) {
      fetch(`${_apiUrl}/api/establishment-position?name=${encodeURIComponent(puntRecollida)}`)
        .then((response) => response.json())
        .then((data) => {
          setStartLocation([data.location_x, data.location_y]);
        })
        .catch((error) => console.error("Error fetching start location:", error));
    }
  }, [puntRecollida]);

  useEffect(() => {
    if (destinacio) {
      fetch(`${_apiUrl}/api/establishment-position?name=${encodeURIComponent(destinacio)}`)
        .then((response) => response.json())
        .then((data) => {
          setEndLocation([data.location_x, data.location_y]);
        })
        .catch((error) => console.error("Error fetching end location:", error));
    }
  }, [destinacio]);

  useEffect(() => {
    const destinoGuardado = localStorage.getItem('destinoReserva');
    if (destinoGuardado) {
      setDestinacio(destinoGuardado);
      localStorage.removeItem('destinoReserva'); // Opcional: limpiar después de usar
    }
  }, []);

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
      const res = await fetch(`${_apiUrl}/api/reserves/usuari`, {
      //const res = await fetch(`http://localhost:8000/api/reserves/usuari`, {
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

  const handleVerReservas = async () => {
    setLoadingReservas(true);
    setShowReservas(!showReservas);
    const token = Cookies.get("token");
    try {
      const res = await fetch(`${_apiUrl}/api/user-reserves`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Respuesta reservas:", data);
        let reservas = [];
        if (Array.isArray(data)) {
          reservas = data;
        } else if (Array.isArray(data.reserves)) {
          reservas = data.reserves;
        } else if (Array.isArray(data.Reservas)) {
          reservas = data.Reservas;
        } else if (Array.isArray(data.reservas)) {
          reservas = data.reservas;
        }
        // Aseguramos que reservas es un array
        setMisReservas(Array.isArray(reservas) ? reservas : []);
      } else {
        setMisReservas([]);
        alert("No se pudieron obtener las reservas");
      }
    } catch (err) {
      setMisReservas([]);
      alert("Error al obtener reservas: " + err.message);
    }
    setLoadingReservas(false);
  };

  const handleValoracionChange = (idx, field, value) => {
    setValoracions(prev => ({
      ...prev,
      [idx]: {
        ...prev[idx],
        [field]: value
      }
    }));
  };

  const handleEnviarValoracion = async (idx, reserva) => {
    const token = Cookies.get("token");
    const { rating, comment } = valoracions[idx] || {};
    if (!rating || !comment) {
      alert("Por favor, introduce una valoración y un comentario.");
      return;
    }
    try {
      const res = await fetch(`${_apiUrl}/api/route-rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          scheduled_time: reserva.scheduled_time,
          rating: parseInt(rating),
          comment
        })
      });
      if (res.ok) {
        alert("Valoración añadida correctamente");
      } else {
        const err = await res.json();
        alert("Error al enviar valoración: " + (err.detail || res.statusText));
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
        <div className="navbar-right-reservas">
          <button className="reservas-perfil-button" onClick={() => window.location.href = "/UserProfile"}>
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
              <div className="back-btn-row">
                <BackButton label="Enrere" />
                <h1 className="section-title">Reserva de Vehicle</h1>
              </div>
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

                <button type="submit" className="btn btn-filled reservar-btn confirmar-reserva-btn">
                  Confirmar Reserva
                </button>
                <button type="button" className="btn btn-filled" style={{marginTop: 16}} onClick={handleVerReservas}>
                  Ver mis reservas
                </button>
                {showReservas && (
                  <div className="mis-reservas-modal">
                    {loadingReservas ? (
                      <p>Cargando reservas...</p>
                    ) : misReservas.length === 0 ? (
                      <p>No tienes reservas.</p>
                    ) : (
                      <ul>
                        {misReservas.map((res, idx) => (
                          <li key={idx}>
                            <div className="reserva-info"><b>Origen:</b> {res.start_location}</div>
                            <div className="reserva-info"><b>Destino:</b> {res.end_location}</div>
                            <div className="reserva-info"><b>Fecha:</b> {res.scheduled_time}</div>
                            <div className="reserva-info"><b>Estado:</b> {res.state}</div>
                            <div className="valoracion-row">
                              <label>Valoració: </label>
                              <select className="valoracion-select" value={(valoracions[idx] && valoracions[idx].rating) || ''} onChange={e => handleValoracionChange(idx, 'rating', e.target.value)}>
                                <option value="">Selecciona</option>
                                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                              </select>
                              <input className="valoracion-input" type="text" placeholder="Comentario" value={(valoracions[idx] && valoracions[idx].comment) || ''} onChange={e => handleValoracionChange(idx, 'comment', e.target.value)} />
                              <button type="button" className="valoracion-btn" onClick={() => handleEnviarValoracion(idx, res)}>Enviar valoración</button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                    <button className="btn cerrar-btn" onClick={() => setShowReservas(false)}>Cerrar</button>
                  </div>
                )}
              </form>
            </div>
          </div>
          <div className="mapa-container">
            <div className="mapa-wrapper">
              <IndoorMap startLocation={startLocation} endLocation={endLocation} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReservaCotxe;
