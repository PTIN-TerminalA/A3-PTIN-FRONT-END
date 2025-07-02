import React, { useState, useEffect } from "react";
import "/src/pages/css/admin.css";
import "/src/pages/css/superadmin.css";
import LogOutButton from "/src/components/LogOutButton.jsx";
import Cookies from "js-cookie";
import logoBlanco from "/src/pages/images/LogoBlanco.png";
import perfil from "/src/pages/images/perfil.png";
import adminPhoto from "/src/pages/images/Portrait_Placeholder.png";
import { useNavigate } from "react-router-dom";

function SuperAdmin() {
  const [admins, setAdmins] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    name: "",
    lastname: "",
    dni: "",
    email: "",
    password: "",
    superadmin: false
  });
  const [adminName, setAdminName] = useState("");

  const [errors, setErrors] = useState({
    dniFormat: true,
    passwordStrength: true,
    nameRequired: true,
    lastnameRequired: true,
  });

  const API_BASE_URL = "https://flysy.software";
  const _apiUrlLocal = "http://127.0.0.1:8000";


useEffect(() => {
  fetchAdmins();

  const checkSuperAdmin = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Consultamos el tipo de usuario
      const res = await fetch(`${API_BASE_URL}/api/get-user-type`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!res.ok) {
        navigate("/login");
        return;
      }

      const data = await res.json();

      if (data.user_type !== "superadmin") {
        // Si no es superadmin, redirigimos
        navigate("/login");
        return;
      }

      // Si es superadmin, seguimos y cargamos perfil
      const profileRes = await fetch(`${API_BASE_URL}/api/profile`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setAdminName(profileData.name);
      } else {
        setAdminName("Nom Admin");
      }

    } catch (error) {
      setAdminName("Nom Admin");
      navigate("/login");
    }
  };

  checkSuperAdmin();
}, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admins`);
      const data = await response.json();
      setAdmins(data);
    } catch (err) {
      console.error("Error fetching admins:", err);
    }
  };

  const validateAdminForm = () => {
    let valid = true;
    let newErrors = {
      dniFormat: true,
      passwordStrength: true,
      nameRequired: true,
      lastnameRequired: true,
    };

    if (!newAdminData.name.trim()) {
      valid = false;
      newErrors.nameRequired = false;
    }

    if (!newAdminData.lastname.trim()) {
      valid = false;
      newErrors.lastnameRequired = false;
    }

    const dniPattern = /^\d{8}[A-Za-z]$/;
    if (!dniPattern.test(newAdminData.dni)) {
      valid = false;
      newErrors.dniFormat = false;
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;,.<>?/-]).{8,}$/;
    if (!passwordPattern.test(newAdminData.password)) {
      valid = false;
      newErrors.passwordStrength = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const resetForm = () => {
    setNewAdminData({
      name: "",
      lastname: "",
      dni: "",
      email: "",
      password: "",
      superadmin: false
    });
    setErrors({
      dniFormat: true,
      passwordStrength: true,
      nameRequired: true,
      lastnameRequired: true,
    });
  };

  const createAdmin = async (e) => {
    e.preventDefault();
    if (!validateAdminForm()) return;

    try {
      const userRes = await fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${newAdminData.name} ${newAdminData.lastname}`,
          email: newAdminData.email,
          dni: newAdminData.dni,
          password: newAdminData.password,
          usertype: "2"
        })
      });

      if (!userRes.ok) throw new Error("Error creando usuario");
      const userData = await userRes.json();

      const adminRes = await fetch(`${API_BASE_URL}/api/register-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: userData.access_token,
          superadmin: newAdminData.superadmin
        })
      });

      if (!adminRes.ok) throw new Error("Error creando admin");

      alert("Admin creado con éxito");
      fetchAdmins();
      setShowCreateForm(false);
      resetForm();
    } catch (err) {
      console.error("Error creando admin:", err);
      alert("Error creando admin");
    }
  };

  const deleteAdmin = async (adminId) => {
    if (!window.confirm("¿Seguro que quieres eliminar este admin?")) return;
    try {
      await fetch(`${API_BASE_URL}/api/admins/${adminId}/full`, { method: "DELETE" });
      fetchAdmins();
      setSelectedAdmin(null);
    } catch (err) {
      console.error("Error eliminando admin:", err);
      alert("Error eliminando admin");
    }
  };

  const filteredAdmins = admins.filter(a =>
    a.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-page">
      <header className="admin-navbar">
        <div className="admin-logo-section">
          <img src={logoBlanco} alt="Logo" className="admin-logo" />
        </div>
        <div className="admin-navbar-center">
          <a href="#superadmin">Pàgina de super admin</a>
        </div>
        <div className="admin-navbar-buttons">
          <button onClick={() => window.location.href = "/UserProfile"}>
            <img src={perfil} alt="Perfil" />
          </button>
          <LogOutButton />
        </div>
      </header>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="superadmin-profile">
            <img src={adminPhoto} alt="SuperAdmin" className="superadmin-photo" />
            <h2>{adminName || "Nom Admin"}</h2>
          </div>
          <div className="admin-buttons">
            <button onClick={() => {
              resetForm();
              setShowCreateForm(true);
            }}>
              Crear Admin
            </button>
            <button onClick={() => { fetchAdmins(); setShowCreateForm(false); }}>
              Veure Admins
            </button>
          </div>
        </aside>

        <main className="admin-main-content">
          {showCreateForm ? (
            <div className="admin-create-center-wrapper">
              <form className="admin-create-form" onSubmit={createAdmin} autoComplete="off">
                <div className="input-group">
                  <label>Nom:</label>
                  <input
                    type="text"
                    value={newAdminData.name}
                    onChange={(e) => setNewAdminData({ ...newAdminData, name: e.target.value })}
                  />
                  {!errors.nameRequired && <span className="error">Nom obligatori</span>}
                </div>

                <div className="input-group">
                  <label>Cognoms:</label>
                  <input
                    type="text"
                    value={newAdminData.lastname}
                    onChange={(e) => setNewAdminData({ ...newAdminData, lastname: e.target.value })}
                  />
                  {!errors.lastnameRequired && <span className="error">Cognom obligatori</span>}
                </div>

                <div className="input-group">
                  <label>DNI:</label>
                  <input
                    type="text"
                    value={newAdminData.dni}
                    onChange={(e) => setNewAdminData({ ...newAdminData, dni: e.target.value })}
                  />
                  {!errors.dniFormat && <span className="error">Format de DNI invàlid</span>}
                </div>

                <div className="input-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    autoComplete="new-email"
                    value={newAdminData.email}
                    onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
                  />
                </div>

                <div className="input-group">
                  <label>Contrasenya:</label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={newAdminData.password}
                    onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })}
                  />
                  {!errors.passwordStrength && (
                    <span className="error">
                      La contrasenya ha de tenir mínim 8 caràcters, una majúscula, una minúscula, un número i un símbol.
                    </span>
                  )}
                </div>

                <label className="admin-checkbox">
                  <input
                    type="checkbox"
                    checked={newAdminData.superadmin}
                    onChange={(e) => setNewAdminData({ ...newAdminData, superadmin: e.target.checked })}
                  />
                  SuperAdmin
                </label>

                <button type="submit">Registrar-se</button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    resetForm();
                    setShowCreateForm(false);
                    fetchAdmins();
                  }}
                >
                  Cancel·lar
                </button>
              </form>
            </div>
          ) : (
            <>
              <div className="admin-searchbar">
                <input
                  type="text"
                  placeholder="Buscar por nombre o apellido"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="admin-cards-container">
                {filteredAdmins.map(a => (
                  <div
                    key={a.id}
                    className="admin-card"
                    onClick={() =>
                      setSelectedAdmin(selectedAdmin?.id === a.id ? null : a)
                    }
                  >
                    <div className="admin-emoji">👤</div>
                    <div className="admin-card-name">{a.user?.name}</div>
                    {selectedAdmin?.id === a.id && (
                      <div className="admin-card-details">
                        <p>Email: {a.user?.email}</p>
                        <p>SuperAdmin: {a.superadmin ? "Sí" : "No"}</p>
                        <button onClick={(e) => {
                          e.stopPropagation();
                          deleteAdmin(a.id);
                        }}>Eliminar Admin</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default SuperAdmin;
