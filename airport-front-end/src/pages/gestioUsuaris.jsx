import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "/src/pages/images/LogoBlanco.png";
import "./css/gestioUsuaris.css";

function gestioUsuaris() {
  const navigate = useNavigate();

  const [searchName, setSearchName] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);

  const dummyUsers = [
    {
      name: "Joan Garcia",
      email: "joan@example.com",
      phone: "612345678",
      age: 35,
      gender: "Home",
    },
    {
      name: "Maria López",
      email: "maria@example.com",
      phone: "698765432",
      age: 28,
      gender: "Dona",
    },
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchName(value);

    if (value.trim() === "") {
      setSelectedUser(null);
      setIsEditing(false);
      return;
    }

    const foundUser = dummyUsers.find((user) =>
      user.name.toLowerCase().includes(value.trim().toLowerCase())
    );
    setSelectedUser(foundUser || null);
    setIsEditing(false);
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      const confirmDelete = window.confirm(
        `Estàs segur que vols eliminar l'usuari "${selectedUser.name}" definitivament?`
      );
      if (confirmDelete) {
        console.log(`Usuari eliminat: ${selectedUser.name}`);
        setSelectedUser(null);
        setSearchName("");
        setIsEditing(false);
      }
    }
  };

  const handleModifyUser = () => {
    if (selectedUser) {
      setIsEditing(true);
      setEditedUser({ ...selectedUser });
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    setSelectedUser(editedUser);
    setIsEditing(false);
    console.log("Usuari modificat:", editedUser);
  };

  const avatarSrc = selectedUser?.name
    ? `https://api.dicebear.com/7.x/initials/svg?seed=${selectedUser.name}`
    : "";

  return (
    <div className="register-wrapper">
      <header className="register-header">
        <img src={logo} alt="Logo" className="register-logo" />
      </header>

      <h1 className="register-title">Gestió d'Usuaris</h1>

      <form className="register-form" onSubmit={(e) => e.preventDefault()}>
        <div className="input-group full-width search-group">
          <label>Buscar usuari per nom</label>
          <div className="search-wrapper">
            <input
              type="text"
              name="searchName"
              value={searchName}
              onChange={handleSearchChange}
              placeholder="Introdueix el nom de l'usuari"
            />
            {searchName && (
              <button
                type="button"
                className="clear-search"
                onClick={() => {
                  setSearchName("");
                  setSelectedUser(null);
                  setIsEditing(false);
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {selectedUser && (
          <div className="user-info centered">
            {avatarSrc && (
              <img src={avatarSrc} alt="Avatar usuari" className="user-photo" />
            )}

            {isEditing ? (
              <>
                <div className="user-field">
                  <label>Nom:</label>
                  <input
                    type="text"
                    name="name"
                    value={editedUser.name}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="user-field">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={editedUser.email}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="user-field">
                  <label>Telèfon:</label>
                  <input
                    type="text"
                    name="phone"
                    value={editedUser.phone}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="user-field">
                  <label>Edat:</label>
                  <input
                    type="number"
                    name="age"
                    value={editedUser.age}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="user-field">
                  <label>Gènere:</label>
                  <input
                    type="text"
                    name="gender"
                    value={editedUser.gender}
                    onChange={handleEditChange}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="user-field"><strong>Nom:</strong> {selectedUser.name}</div>
                <div className="user-field"><strong>Email:</strong> {selectedUser.email}</div>
                <div className="user-field"><strong>Telèfon:</strong> {selectedUser.phone}</div>
                <div className="user-field"><strong>Edat:</strong> {selectedUser.age}</div>
                <div className="user-field"><strong>Gènere:</strong> {selectedUser.gender}</div>
              </>
            )}

            <div className="action-buttons">
              {isEditing ? (
                <button type="button" className="register-button" onClick={handleSaveChanges}>
                  Guardar canvis
                </button>
              ) : (
                <button type="button" className="register-button" onClick={handleModifyUser}>
                  Modificar usuari
                </button>
              )}
              <button type="button" className="eliminar-btn" onClick={handleDeleteUser}>
                Eliminar
              </button>
            </div>
          </div>
        )}

        {!selectedUser && (
          <>
            <div className="input-group full-width">
              <button
                type="button"
                className="register-button full-width"
                onClick={() => navigate("/createUser")}
              >
                Crear nou usuari
              </button>
            </div>
            <div className="input-group full-width">
              <button
                type="button"
                className="register-button full-width"
                onClick={() => window.history.back()}
              >
                Tornar enrere
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default gestioUsuaris;
