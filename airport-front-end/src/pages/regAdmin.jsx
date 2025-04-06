import React, { useState } from 'react';
import '../components/regAdmin.css';
import logo from '../components/logo.png'; 


function RegAdmin() {
  const currentUserRole = 'superadmin'; // o 'admin'
 //const currentUserRole = 'admin';
  const [selectedRole, setSelectedRole] = useState(
    currentUserRole === 'superadmin' ? "" : "treballador"
  );

  const [formData, setFormData] = useState({
    nom: '',
    cognoms: '',
    dni: '',
    email: '',
    contrasenya: '',
    confirmContrasenya: '',
    aerolinea: ''
  });

  const [mostrarContrasenya, setMostrarContrasenya] = useState(false);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handleRoleChange(e) {
    setSelectedRole(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const roleToRegister = currentUserRole === 'admin' ? "treballador" : selectedRole;
    console.log("Dades del formulari:", { roleToRegister, ...formData });
  }

  return (
    <div className="regAdmin-container">
      {/* Capçalera amb logo + títol */}
      <div className="regAdmin-header">
        <img src={logo} alt="Logo" className="regAdmin-logo" />
        <h1 className="regAdmin-title">
          Registrar{" "}
          {currentUserRole === 'admin'
            ? 'Treballador'
            : (selectedRole
                ? (selectedRole === 'admin' ? 'Admin' : 'Treballador')
                : ''
              )
          }
        </h1>
      </div>

      <p className="regAdmin-info">* Tots els camps són obligatoris.</p>

      <form onSubmit={handleSubmit} className="regAdmin-form">
        {currentUserRole === 'superadmin' ? (
          <div>
            <label htmlFor="role">Selecciona el rol:</label>
            <select id="role" value={selectedRole} onChange={handleRoleChange} required>
              <option value="">Selecciona</option>
              <option value="admin">Admin</option>
              <option value="treballador">Treballador</option>
            </select>
          </div>
        ) : (
          <p className="regAdmin-fixedRole">
            <strong>Rol:</strong> Treballador
          </p>
        )}

        <div>
          <label htmlFor="nom">Nom:</label>
          <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleInputChange} required placeholder="Ex: Maria" />
        </div>

        <div>
          <label htmlFor="cognoms">Cognoms:</label>
          <input type="text" id="cognoms" name="cognoms" value={formData.cognoms} onChange={handleInputChange} required placeholder="Ex: Costa Puig" />
        </div>

        <div>
          <label htmlFor="dni">DNI:</label>
          <input type="text" id="dni" name="dni" value={formData.dni} onChange={handleInputChange} required placeholder="Ex: 12345678A" />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="Ex: maria@gmail.com" />
        </div>

        <div>
          <label htmlFor="contrasenya">Contrasenya:</label>
          <input
            type={mostrarContrasenya ? "text" : "password"}
            id="contrasenya"
            name="contrasenya"
            value={formData.contrasenya}
            onChange={handleInputChange}
            required
            placeholder="Crea una contrasenya"
          />
        </div>

        <div>
          <label htmlFor="confirmContrasenya">Confirmar Contrasenya:</label>
          <input
            type={mostrarContrasenya ? "text" : "password"}
            id="confirmContrasenya"
            name="confirmContrasenya"
            value={formData.confirmContrasenya}
            onChange={handleInputChange}
            required
            placeholder="Repeteix la contrasenya"
          />
        </div>

        {/* Mostrar/Ocultar contrasenya */}
        <div>
          <label>
            <input
              type="checkbox"
              checked={mostrarContrasenya}
              onChange={(e) => setMostrarContrasenya(e.target.checked)}
            />{" "}
            Mostrar contrasenya 👁️
          </label>
        </div>

        {(currentUserRole === 'admin' || selectedRole === 'treballador') && (
          <div>
            <label htmlFor="aerolinea">Aerolínia:</label>
            <input
              type="text"
              id="aerolinea"
              name="aerolinea"
              value={formData.aerolinea}
              onChange={handleInputChange}
              required
              placeholder="Ex: Vueling"
            />
          </div>
        )}

        <div className="regAdmin-buttons">
          <button type="button" onClick={() => window.history.back()}>
            Tornar enrere
          </button>
          <button type="submit">Registrar</button>
        </div>
      </form>
    </div>
  );
}

export default RegAdmin;