// GoogleLoginButton.js
import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleLoginButton = () => {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (response) => {
    console.log('Google login success:', response);
    setUser(response);
  };

  const handleLoginFailure = (error) => {
    console.error('Google login failure:', error);
  };

  return (
    <div>
      <h2>Inicia sesión con Google</h2>
      <GoogleLogin 
        onSuccess={handleLoginSuccess}
        onError={handleLoginFailure}
      />
      {user && (
        <div>
          <h3>Usuario Logueado</h3>
          <p>Nombre: {user.profileObj.name}</p>
          <p>Email: {user.profileObj.email}</p>
          <img src={user.profileObj.imageUrl} alt="User profile" />
        </div>
      )}
    </div>
  );
};

export default GoogleLoginButton;
