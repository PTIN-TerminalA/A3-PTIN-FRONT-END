import React, { useState } from 'react';
import EditProfileModal from '../components/EditProfileModal';
import '../components/adminProfile.css';

const AdminProfile = () => {
  const [userData, setUserData] = useState({
    nom: 'Joan',
    cognom: 'Garcia',
    email: 'admin@vilanova.cat',
    telefon: '+34 666666666',
    rol: 'Administrador',
    avatarUrl: ''
  });

  const [showModal, setShowModal] = useState(false);

  const avatarSrc = userData.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${userData.nom}`;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img
          src={avatarSrc}
          alt="avatar"
          className="profile-avatar"
        />
        <h1 className="profile-name">{userData.nom} {userData.cognom}</h1>
        <p className="profile-role">{userData.rol}</p>
        <div className="profile-info">
          <p><strong>Correu:</strong> {userData.email}</p>
          <p><strong>Telèfon:</strong> {userData.telefon}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="profile-edit-button"
        >
          Editar perfil
        </button>
      </div>

      {showModal && (
        <EditProfileModal
          userData={userData}
          setUserData={setUserData}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default AdminProfile;