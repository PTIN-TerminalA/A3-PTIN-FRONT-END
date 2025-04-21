import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from '../components/EditProfileModal';
import '../components/assets/adminProfile.css';
import Cookies from 'js-cookie';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = Cookies.get('token');
      try {
        const response = await fetch(`http://localhost:8000/api/profile?token=${token}`);
        if (!response.ok) {
          throw new Error('Error al obtener el perfil');
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  if (!userData) return <p>Carregant...</p>;

  const avatarSrc = `https://api.dicebear.com/7.x/initials/svg?seed=${userData.name}`;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <button className="close-button" onClick={() => navigate('/mainpage')}>×</button>
        <img src={avatarSrc} alt="avatar" className="profile-avatar" />
        <h1 className="profile-name">{userData.name}</h1>
        <div className="profile-info">
          <p><strong>Correu:</strong> {userData.email}</p>
          <p><strong>Telèfon:</strong> {userData.phone_num || 'No disponible'}</p>
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
