import React, { useState } from 'react';
import './PagTreballador.css';
import ReservaCard from '../components/ReservaCard';
import { FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PagTreballador = () => {
  const navigate = useNavigate();

  const [novaReserva, setNovaReserva] = useState({
    dni: '',
    data: '',
    hora: '',
    vehicle: '',
  });

  const vehiclesDisponibles = ['1234ABC', '5678DEF', '9999ZZZ'];

  const [reserves, setReserves] = useState([
    {
      dni: '12345678A',
      data: '2025-04-01',
      hora: '10:00',
      matricula: '1234ABC',
      tipus: 'Futura',
    },
    {
      dni: '87654321B',
      data: '2025-03-20',
      hora: '16:30',
      matricula: '5678DEF',
      tipus: 'Històrica',
    },
  ]);

  const [filtre, setFiltre] = useState({
    dni: '',
    data: '',
    matricula: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovaReserva({ ...novaReserva, [name]: value });
  };

  const handleFiltreChange = (e) => {
    const { name, value } = e.target;
    setFiltre({ ...filtre, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nova = {
      dni: novaReserva.dni,
      data: novaReserva.data,
      hora: novaReserva.hora,
      matricula: novaReserva.vehicle,
      tipus: 'Futura',
    };
    setReserves([...reserves, nova]);
    alert('Reserva afegida!');
    setNovaReserva({ dni: '', data: '', hora: '', vehicle: '' });
  };

  return (
    <div className="pag-treballador">
      {/* Barra superior */}
      <div className="navbar">
        <button className="logout-btn" onClick={() => navigate('/')}>
          <FaSignOutAlt /> Logout
        </button>
        <div className="icons-right">
          <FaBell className="icon noti-icon" title="Notificacions" />
          <FaUserCircle
            className="icon profile-icon"
            title="Perfil"
            onClick={() => navigate('/workerprofile')}
          />
        </div>
      </div>

      <h2>Benvingut/a Treballador/a</h2>

      <h3>Nova reserva</h3>
      <form className="formulari-reserva" onSubmit={handleSubmit}>
        <input
          type="text"
          name="dni"
          placeholder="DNI client"
          value={novaReserva.dni}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="data"
          value={novaReserva.data}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="hora"
          value={novaReserva.hora}
          onChange={handleChange}
          required
        />
        <select
          name="vehicle"
          value={novaReserva.vehicle}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona un vehicle</option>
          {vehiclesDisponibles.map((matricula, index) => (
            <option key={index} value={matricula}>
              {matricula}
            </option>
          ))}
        </select>
        <button type="submit">Guardar reserva</button>
      </form>

      <h3>Filtrar reserves</h3>
      <div className="filtres">
        <input type="text" name="dni" placeholder="Filtrar per DNI" onChange={handleFiltreChange} />
        <input type="date" name="data" placeholder="Filtrar per data" onChange={handleFiltreChange} />
        <input type="text" name="matricula" placeholder="Filtrar per matrícula" onChange={handleFiltreChange} />
      </div>

      <div className="llista-reserves">
        {reserves
          .filter((reserva) =>
            reserva.dni.includes(filtre.dni) &&
            reserva.data.includes(filtre.data) &&
            reserva.matricula.includes(filtre.matricula)
          )
          .map((reserva, index) => (
            <ReservaCard key={index} reserva={reserva} />
          ))}
      </div>
    </div>
  );
};

export default PagTreballador;
