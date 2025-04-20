import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from '../components/EditProfileModal';
import '../components/assets/adminProfile.css';

const UserProfile = () => {
  const [userData, setUserData] = useState({
    nom: 'Maria',
    cognom: 'López',
    email: 'usuari@vilanova.cat',
    telefon: '+34 600111222',
    rol: 'Usuari',
    avatarUrl: ''
  });

  const [showModal, setShowModal] = useState(false);
  const avatarSrc = userData.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${userData.nom}`;
  const navigate = useNavigate();

  return (
    <div className="profile-container">
      <div className="profile-card">
        <button className="close-button" onClick={() => navigate('/mainpage')}>×</button>
        <img src={avatarSrc} alt="avatar" className="profile-avatar" />
        <h1 className="profile-name">{userData.nom} {userData.cognom}</h1>
        <p className="profile-role">{userData.rol}</p>
        <div className="profile-info">
          <p><strong>Correu:</strong> {userData.email}</p>
          <p><strong>Telèfon:</strong> {userData.telefon}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="profile-edit-button">
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

export default UserProfile;
