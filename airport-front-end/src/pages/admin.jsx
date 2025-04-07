import "./css/admin.css";

function Admin() {
  return (
    <div className="admin-page">
      {/* NAVBAR */}
      <div className="navbar">
        {/* Logo + Título */}
        <div className="navbar-titlelogo">
          <img src="/src/pages/images/logo.jpeg" className="navbar-logo" alt="Logo" />
          <div className="navbar-title">Administrador</div>
        </div>

        {/* Botones a la derecha del navbar */}
        <div className="navbar-buttons">
          <button className="navbar-button" onClick={() => window.location.href = "/perfil"}>
            Perfil
          </button>
          <button className="navbar-button" onClick={() => window.location.href = "/"}>
            Tancar sessió
          </button>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="admin-layout">
        {/* Sidebar izquierda */}
        <div className="admin-sidebar">
          <div className="admin-profile-pic" />
          <p className="admin-name">Nom Administrador</p>

          <div className="admin-buttons">
            <button className="admin-btn" onClick={() => window.location.href = "/gestioUsuaris"}>Gestionar Usuaris</button>
            <button className="admin-btn" onClick={() => window.location.href = "/gestioReserves"}>Gestionar Reserves</button>
            <button className="admin-btn" onClick={() => window.location.href = "/gestioCotxes"}>Gestionar Cotxes</button>
          </div>
        </div>

        {/* Mapa */}
        <div className="admin-map-container">
          <img
            src="/src/pages/images/map.png"
            alt="Mapa estàtic"
            className="admin-map-image"
          />
          <button className="back-btn">⬅ Tornar</button>
        </div>
      </div>
    </div>
  );
}
export default Admin;