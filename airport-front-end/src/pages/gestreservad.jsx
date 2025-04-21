import React, { useState, useEffect } from 'react';
import '../components/assets/gestreservad.css';

const ESTATS = ['pendent', 'confirmada', 'cancelada'];

const mockReserves = [
  { id: 1, nomClient: 'Anna Puig', data: '2025-04-20', hora: '10:00', estat: 'pendent' },
  { id: 2, nomClient: 'Marc Riera', data: '2025-04-22', hora: '15:30', estat: 'confirmada' },
  { id: 3, nomClient: 'Laura Sánchez', data: '2025-04-25', hora: '09:15', estat: 'pendent' },
  { id: 4, nomClient: 'Jordi Soler', data: '2025-04-26', hora: '13:45', estat: 'cancelada' },
  { id: 5, nomClient: 'Clara Valls', data: '2025-04-27', hora: '12:00', estat: 'confirmada' },
  { id: 6, nomClient: 'Pau Vidal', data: '2025-04-28', hora: '11:30', estat: 'pendent' },
  { id: 7, nomClient: 'Núria Prats', data: '2025-04-29', hora: '17:00', estat: 'confirmada' },
  { id: 8, nomClient: 'Albert Bosch', data: '2025-05-01', hora: '08:00', estat: 'pendent' }
];

function GestioReserva() {
  const [reserves, setReserves] = useState([]);
  const [reservaEditant, setReservaEditant] = useState(null);
  const [missatge, setMissatge] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setReserves(mockReserves);
  }, []);

  const handleSearch = e => {
    setSearchTerm(e.target.value);
  };

  const filtered = reserves.filter(r =>
    r.nomClient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = reserva => {
    setReservaEditant({ ...reserva });
    setMissatge('');
  };

  const handleDelete = id => {
    if (window.confirm('Vols eliminar aquesta reserva?')) {
      setReserves(reserves.filter(r => r.id !== id));
      setMissatge('Reserva eliminada correctament.');
      if (reservaEditant && reservaEditant.id === id) {
        setReservaEditant(null);
      }
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setReservaEditant(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!reservaEditant.nomClient || !reservaEditant.data || !reservaEditant.hora) {
      setMissatge('Omple tots els camps obligatoris.');
      return;
    }
    setReserves(prev =>
      prev.map(r => (r.id === reservaEditant.id ? reservaEditant : r))
    );
    setMissatge('Reserva actualitzada correctament.');
    setReservaEditant(null);
  };

  return (
    <div className="gestio-container">
      <h1 className="gestio-title">Gestió de Reserves</h1>

      <div className="gestio-search-container">
        <input
          type="text"
          placeholder="Buscar client..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {missatge && <p className="gestio-missatge">{missatge}</p>}

      <div className="gestio-content">
        {/* Tabla de reservas */}
        <div className="gestio-taula-container">
          <table className="gestio-taula">
            <thead>
              <tr>
                <th>Client</th>
                <th>Data</th>
                <th>Hora</th>
                <th>Estat</th>
                <th>Accions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(reserva => (
                <tr key={reserva.id}>
                  <td>{reserva.nomClient}</td>
                  <td>{reserva.data}</td>
                  <td>{reserva.hora}</td>
                  <td>{reserva.estat}</td>
                  <td>
                    <button onClick={() => handleEdit(reserva)}>Editar</button>
                    <button onClick={() => handleDelete(reserva.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Columna de formulario */}
        <div className="gestio-form-column">
          {reservaEditant ? (
            <div className="gestio-formulari">
              <h2>Editar Reserva</h2>
              <label>Nom:</label>
              <input
                type="text"
                name="nomClient"
                value={reservaEditant.nomClient}
                onChange={handleChange}
                required
              />

              <label>Data:</label>
              <input
                type="date"
                name="data"
                value={reservaEditant.data}
                onChange={handleChange}
                required
              />

              <label>Hora:</label>
              <input
                type="time"
                name="hora"
                value={reservaEditant.hora}
                onChange={handleChange}
                required
              />

              <label>Estat:</label>
              <select
                name="estat"
                value={reservaEditant.estat}
                onChange={handleChange}
              >
                {ESTATS.map(e => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>

              <div className="gestio-botons">
                <button onClick={handleSave}>Desar</button>
                <button onClick={() => setReservaEditant(null)}>Cancel·lar</button>
              </div>
            </div>
          ) : (
            <div className="gestio-empty">
              <p>Selecciona una reserva per editar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GestioReserva;
