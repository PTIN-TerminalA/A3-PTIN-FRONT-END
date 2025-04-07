import React from 'react';
import '../components/assets/mainpage.css'; 
import logo from '../components/assets/logo.png'; 
import mapaVirtual from '../components/assets/mapavirtual.png';

// ========== Barra Superior (Header) ==========
function Header() {
  return (
    <header className="header">
      <div className="header-left">
        {/* Mostrem el logo i el títol */}
        <img src={logo} alt="Logo Aeroport" className="logo" />
      </div>
      <div className="header-right">
        <NotificationsButton />
        <ProfileButton />
        <LogoutButton />
      </div>
    </header>
  );
}

function NotificationsButton() {
  return <button>🔔 Notificacions</button>;
}
function ProfileButton() {
  return <button>Veure Perfil</button>;
}
function LogoutButton() {
  return <button>Sortir</button>;
}

/* ========== Secció del mapa (amplada completa) ========== */
function MapSection() {
  return (
    <section className="map-section">
      <h2>Mapa de l'Aeroport</h2>
      <div className="map-image-container">
      <img src={mapaVirtual} alt="Mapa Virtual de l'Aeroport" className="map-image" />
    </div>
    </section>
  );
}

/* ========== Secció Comerços i Oci (amplada completa, amb carrusel) ========== */
function ShopsLeisureExtended() {
  return (
    <section className="shops-leisure-extended">
      <h2>Comerços i Oci</h2>
      <p>Consulta els comerços i oci de l'aeroport per descobrir ofertes i serveis.</p>
      <div className="carousel">
        <img
          src="https://withfor.com/wp-content/uploads/2022/07/696c745675e78971ed170d16d26efdac-1536x1024.jpg"
          alt="Comerços i Oci 1"
        />
        <img
          src="https://www.mundodeportivo.com/palco23/files/2021/17_clubes/fc-barcelona/fc-barcelona-tienda-980.jpg"
          alt="Comerços i Oci 2"
        />
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU-29Tbk47ytwtbRwuWTHmIQYk5eHJF1CQLw&s"
          alt="Comerços i Oci 3"
        />
        <img
          src="https://i.blogs.es/c2a266/burn_50_21480104_294340901049484_1535366888954003456_n/650_1200.jpg"
          alt="Comerços i Oci 4"
        />
        <img
          src="https://www.lavanguardia.com/files/og_thumbnail/files/fp/uploads/2024/01/31/65ba0b2f90c3a.r_d.567-490-11719.jpeg"
          alt="Comerços i Oci 5"
        />
      </div>
      <button>Veure Més</button>
    </section>
  );
}

/* ========== Secció: Reserva d'automòbil (graella) ========== */
function CarReservation() {
  return (
    <section className="section car-reservation">
      <h3>Reserva d'Automòbil</h3>
      <p>Fes la teva reserva d'un automòbil per moure't amb comoditat.</p>
      <button>Reserva d'Automòbil</button>
    </section>
  );
}

/* ========== Secció: Informació dels Vols (graella) ========== */
function FlightInfo() {
  return (
    <section className="section flight-info">
      <h3>Informació dels Vols</h3>
      <p>Consulta la informació dels teus vols i estats en temps real.</p>
      <button>Informació dels Vols</button>
    </section>
  );
}

/* ========== Component Principal que agrupa tot ========== */
function MainPage() {
  return (
    <div className="mainpage-container">
      <Header />
      {/* 1) Mapa a dalt */}
      <MapSection />
      {/* 2) Comerços i Oci a amplada completa sota el mapa */}
      <ShopsLeisureExtended />
      {/* 3) Graella per a la resta de seccions */}
      <div className="sections-grid">
        <CarReservation />
        <FlightInfo />
      </div>
    </div>
  );
}

export default MainPage;
