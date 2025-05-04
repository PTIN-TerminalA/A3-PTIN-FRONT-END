import React, { useEffect, useState } from 'react';
import "./css/gestusersa.css";

// Dades fictícies amb més usuaris
const usuarisFake = [
  { id: 1, nom: 'Laura Pérez', dni: '12345678A', email: 'laura@example.com', data_naixement: '1990-01-01', telefon: '612345678', genere: 'female' },
  { id: 2, nom: 'Marc Garcia', dni: '87654321B', email: 'marc@example.com', data_naixement: '1988-06-15', telefon: '698765432', genere: 'male' },
  { id: 3, nom: 'Alex Smith', dni: '11223344C', email: 'alex@example.com', data_naixement: '1995-02-20', telefon: '600112233', genere: 'other' },
  { id: 4, nom: 'Maria López', dni: '44332211D', email: 'maria@example.com', data_naixement: '1992-08-10', telefon: '677889900', genere: 'female' },
  { id: 5, nom: 'Joan Martínez', dni: '55667788E', email: 'joan@example.com', data_naixement: '1985-11-30', telefon: '699887766', genere: 'male' },
  { id: 6, nom: 'Sandra Torres', dni: '99887766F', email: 'sandra@example.com', data_naixement: '1991-04-25', telefon: '634445566', genere: 'female' },
  { id: 7, nom: 'David Ruiz', dni: '22334455G', email: 'david@example.com', data_naixement: '1987-09-12', telefon: '688774411', genere: 'male' },
  { id: 8, nom: 'Chris Jordan', dni: '33445566H', email: 'chris@example.com', data_naixement: '1996-07-03', telefon: '644332211', genere: 'other' },
  { id: 9, nom: 'Anna Vidal', dni: '44556677I', email: 'anna@example.com', data_naixement: '1993-12-19', telefon: '600998877', genere: 'female' },
  { id: 10, nom: 'Pau Navarro', dni: '55667788J', email: 'pau@example.com', data_naixement: '1989-05-05', telefon: '633221144', genere: 'male' }
];

export default function GestioUsuarisAvançada() {
  const [usuaris, setUsuaris] = useState([]);
  const [filtre, setFiltre] = useState('');
  const [usuariSeleccionat, setUsuariSeleccionat] = useState(null);
  const [mode, setMode] = useState(''); // 'editar' o 'crear'

  useEffect(() => {
    setUsuaris(usuarisFake);
  }, []);

  const filtrarUsuaris = () =>
    usuaris.filter(u =>
      u.dni.toLowerCase().includes(filtre.toLowerCase())
    );

  const handleEditaCamp = (camp, valor) => {
    setUsuariSeleccionat(prev => ({ ...prev, [camp]: valor }));
  };

  const obreModalCrear = () => {
    setUsuariSeleccionat({
      id: Date.now(),
      nom: '',
      dni: '',
      email: '',
      data_naixement: '',
      telefon: '',
      genere: 'other',
    });
    setMode('crear');
  };

  const obreModalEditar = usuari => {
    setUsuariSeleccionat({ ...usuari }); // copia per evitar mutació directa
    setMode('editar');
  };

  const tancaModal = () => {
    setUsuariSeleccionat(null);
    setMode('');
  };

  const guardarCanvis = () => {
    if (mode === 'editar') {
      setUsuaris(prev =>
        prev.map(u =>
          u.id === usuariSeleccionat.id ? usuariSeleccionat : u
        )
      );
    } else if (mode === 'crear') {
      setUsuaris(prev => [...prev, usuariSeleccionat]);
    }
    tancaModal();
  };

  const eliminaUsuari = id => {
    if (window.confirm('Segur que vols eliminar aquest usuari?')) {
      setUsuaris(prev => prev.filter(u => u.id !== id));
    }
  };

  return (
    <div className="container-gestio">
      <h2>Gestió d’usuaris</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <input
          type="text"
          className="filtre"
          placeholder="Cerca per DNI..."
          value={filtre}
          onChange={e => setFiltre(e.target.value)}
          style={{ flex: 1, marginRight: '1rem' }}
        />
        <button className="boto-editar" onClick={obreModalCrear}>
          ➕ Nou usuari
        </button>
      </div>

      <div className="scroll-taula">
        <table className="taula-usuaris">
          <thead>
            <tr>
              <th>Nom</th>
              <th>DNI</th>
              <th>Email</th>
              <th>Telèfon</th>
              <th>Gènere</th>
              <th>Accions</th>
            </tr>
          </thead>
          <tbody>
            {filtrarUsuaris().map(u => (
              <tr key={u.id}>
                <td>{u.nom}</td>
                <td>{u.dni}</td>
                <td>{u.email}</td>
                <td>{u.telefon}</td>
                <td>{u.genere}</td>
                <td>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <button className="boto-editar" onClick={() => obreModalEditar(u)}>
                      ✏️ Editar
                    </button>
                    <button className="boto-eliminar" onClick={() => eliminaUsuari(u.id)}>
                      🗑️ Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {usuariSeleccionat && (
        <div className="modal-fons" onClick={tancaModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{mode === 'editar' ? 'Edita usuari' : 'Nou usuari'}</h3>

            {['nom', 'dni', 'email', 'data_naixement', 'telefon', 'genere'].map(camp => (
              <div className="camp-edicio" key={camp}>
                <strong>{camp.replace('_', ' ')}:</strong>
                <input
                  type="text"
                  value={usuariSeleccionat[camp]}
                  onChange={e => handleEditaCamp(camp, e.target.value)}
                />
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button className="tancar" onClick={tancaModal}>
                Cancel·lar
              </button>
              <button className="guardar" onClick={guardarCanvis}>
                {mode === 'editar' ? 'Guardar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
