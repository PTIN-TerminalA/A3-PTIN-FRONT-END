import React, { useState } from 'react';
import './adminProfile.css';

const EditProfileModal = ({ userData, setUserData, onClose }) => {
  const [formData, setFormData] = useState({ ...userData });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = 'El nom és obligatori';
    if (!formData.cognom.trim()) newErrors.cognom = 'El cognom és obligatori';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) newErrors.email = 'Correu electrònic no vàlid';

    const telefonRegex = /^\+34\s?\d{9}$/;
    if (!telefonRegex.test(formData.telefon)) newErrors.telefon = 'Número de telèfon no vàlid. Format: +34 612345678';

    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setUserData(formData);
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg'];
    if (!validTypes.includes(file.type)) {
      alert('Només es permeten imatges PNG o JPG');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, avatarUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const avatarSrc = formData.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${formData.nom}`;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Editar Perfil</h2>

        <div className="avatar-upload-wrapper">
          <label htmlFor="avatar-upload" className="avatar-edit-overlay">
            <img src={avatarSrc} alt="avatar" className="avatar-preview" />
            <div className="edit-icon">✏️</div>
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImageUpload}
            className="hidden-file-input"
          />
        </div>

        <div className="modal-form">
          <input
            type="text"
            placeholder="Nom"
            className="modal-input"
            value={formData.nom}
            onChange={(e) => handleChange('nom', e.target.value)}
          />
          {errors.nom && <p className="error-text">{errors.nom}</p>}

          <input
            type="text"
            placeholder="Cognom"
            className="modal-input"
            value={formData.cognom}
            onChange={(e) => handleChange('cognom', e.target.value)}
          />
          {errors.cognom && <p className="error-text">{errors.cognom}</p>}

          <input
            type="email"
            placeholder="Correu electrònic"
            className="modal-input"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          <input
            type="tel"
            placeholder="Telèfon"
            className="modal-input"
            value={formData.telefon}
            onChange={(e) => handleChange('telefon', e.target.value)}
          />
          {errors.telefon && <p className="error-text">{errors.telefon}</p>}
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="modal-cancel">Cancel·la</button>
          <button onClick={handleSave} className="modal-save">Desa</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
