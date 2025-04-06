import React from 'react';

const ProfileInfoCard = ({ userData, editable = false, onEdit }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Informació del perfil</h2>
      <p><strong>Nom:</strong> {userData.nom}</p>
      <p><strong>Cognom:</strong> {userData.cognom}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Telèfon:</strong> {userData.telefon}</p>
      <p><strong>Rol:</strong> {userData.rol}</p>
      {editable && (
        <button
          onClick={onEdit}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Editar informació
        </button>
      )}
    </div>
  );
};

export default ProfileInfoCard;
