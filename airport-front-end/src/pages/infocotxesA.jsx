// src/pages/infocotxesA.jsx
import React, { useState, useEffect } from 'react';
import './css/infocotxesA.css';

function InfocotxesA() {
  const [cotxes, setCotxes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCotxe, setSelectedCotxe] = useState(null);
  const [nouEstat, setNouEstat] = useState('');

  useEffect(() => {
    fetch('https://flysy.software/api/vehicles')
      .then((res) => res.json())
      .then((data) => setCotxes(data))
      .catch((err) => console.error('Error carregant cotxes:', err));
  }, []);

  const handleSelectChange = (_id, estatActual, nouValor) => {
    if (estatActual === nouValor) return;
    setSelectedCotxe({ _id, estatActual });
    setNouEstat(nouValor);
    setModalVisible(true);
  };

  const confirmarCanvi = () => {
    fetch(`https://flysy.software/api/vehicles/${selectedCotxe._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ state: nouEstat })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al canviar estat');
        const actualitzat = cotxes.map((cotxe) =>
          cotxe._id === selectedCotxe._id ? { ...cotxe, state: nouEstat } : cotxe
        );
        setCotxes(actualitzat);
        tancarModal();
      })
      .catch((err) => console.error(err));
  };

  const tancarModal = () => {
    setModalVisible(false);
    setSelectedCotxe(null);
    setNouEstat('');
  };

  return (
    <div className="cotxes-container">
      <h2>Informació dels Cotxes</h2>
      <table className="cotxes-taula">
        <thead>
          <tr>
            <th>ID</th>
            <th>Estat</th>
            <th>Bateria (%)</th>
          </tr>
        </thead>
        <tbody>
          {cotxes.map((cotxe) => (
            <tr key={cotxe._id}>
              <td>{cotxe._id}</td>
              <td>
                <select
                  value={cotxe.state}
                  onChange={(e) =>
                    handleSelectChange(cotxe._id, cotxe.state, e.target.value)
                  }
                >
                  <option value="Disponible">Disponible</option>
                  <option value="En curs">En curs</option>
                  <option value="Ocupat">Ocupat</option>
                </select>
              </td>
              <td>{cotxe.battery}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cotxes-informacio">
        <div className="stats-card">
          <h3><span className="stats-icon">📊</span> Estadístiques</h3>
          <ul>
            <li>Total de cotxes: {cotxes.length}</li>
            <li>Disponibles: {cotxes.filter(c => c.state === 'Disponible').length}</li>
            <li>En curs: {cotxes.filter(c => c.state === 'En curs').length}</li>
            <li>Ocupats: {cotxes.filter(c => c.state === 'Ocupat').length}</li>
          </ul>
        </div>

        <div className="avisos-card">
          <h3><span className="warn-icon">⚠️</span> Avisos</h3>
          <ul>
            {cotxes.filter(c => c.battery < 30).length === 0 ? (
              <li>Cap problema de bateria detectat.</li>
            ) : (
              cotxes.filter(c => c.battery < 30).map((c) => (
                <li key={c._id}>
                  <span className="warn-icon">🔋</span> Bateria baixa al cotxe {c._id} ({c.battery}%)
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <p>
              Vols realment canviar l’estat del cotxe amb ID <strong>{selectedCotxe._id}</strong> a <strong>{nouEstat}</strong>?
            </p>
            <div className="modal-buttons">
              <button onClick={confirmarCanvi}>Sí</button>
              <button onClick={tancarModal}>Cancel·la</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InfocotxesA;
