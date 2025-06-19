import React, { useState, useEffect } from 'react';
import '/src/pages/css/mainpage.css';
import { useNavigate } from 'react-router-dom';
import LogOutButton from "/src/components/LogOutButton.jsx";
import logo from "/src/pages/images/LogoBlanco.png";
import coche from "/src/pages/images/coche.png";
import avion from "/src/pages/images/avion.png";
import perfil from "/src/pages/images/perfil.png";
import chatbotIcon from "/src/pages/images/chatboticon.png";
import ServiceRatings from "../components/ServiceRatings";
import CreateRatings from "../components/CreateRatings";

// ===== Componente ChatWindow =====
function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  // Simular respuestas automáticas
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].sender === 'user') {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          text: messages[messages.length - 1].text,
          sender: 'bot'
        }]);
      }, 500);
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, sender: 'user' }]);
      setNewMessage('');
    }
  };

  return (
    <div className={`chat-window ${isMinimized ? 'minimized' : ''}`}>
      <div className="chat-header">
        <div className="chat-title">
          <img src={chatbotIcon} alt="Chatbot" className="chatbot-icon-header" />
          Asistente Virtual
        </div>
        <div className="chat-controls">
          <button
            className="minimize-btn"
            aria-label={isMinimized ? "Restaurar" : "Minimizar"}
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? '▢' : '—'}
          </button>
          <br></br>
          <br></br>
          <button className="close-btn" aria-label="Cerrar" onClick={onClose}>✕</button>
        </div>
      </div>
      
      {!isMinimized && (
        <>
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.sender === 'bot' && (
                  <img src={chatbotIcon} alt="Bot" className="message-icon" />
                )}
                <div className="message-bubble">{message.text}</div>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>➤</button>
          </div>
        </>
      )}
    </div>
  );
}
import IndoorMap from "/src/components/MapaLeaflet.jsx"; // 👈 Importamos tu componente Leaflet

// ===== Navbar/Header =====
function Header() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="logo-section">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="icon-section">
        <button title="Chatbot" onClick={() => setIsChatOpen(!isChatOpen)}>
          <img src={chatbotIcon} alt="Chatbot" />
        </button>
        <button title="Perfil" onClick={() => navigate("/UserProfile")}>
          <img src={perfil} alt="Perfil" />
        </button>
        <LogOutButton />
      </div>
      {isChatOpen && <ChatWindow onClose={() => setIsChatOpen(false)} />}
    </header>
  );
}

// ===== Secció del Mapa =====
function MapSection() {
  return (
    <section className="map-section">
      <h2>Mapa de l'Aeroport</h2>
      <div className="map-container" style={{ height: '600px', width: '100%' }}>
        <IndoorMap />
      </div>
    </section>
  );
}

// ===== Botó destacat: Reserva de cotxes =====
function CarReservation() {
  return (
    <a href="/reservacotxe" className="highlight-section car-reservation">
      <div className="highlight-icon">
        <img src={coche} alt="Reserva d'Automòbil" />
      </div>
      <div>
        <h3>Reserva d'Automòbil</h3>
        <p>Evita cues i viatja còmodament des del primer minut</p>
      </div>
    </a>
  );
}

// ===== Botó destacat: Informació de vols =====
function FlightInfo() {
  return (
    <a href="/vols" className="highlight-section flight-info">
      <div className="highlight-icon">
        <img src={avion} alt="Informació dels Vols" />
      </div>
      <div>
        <h3>Informació dels Vols</h3>
        <p>Consulta els teus vols i estats en temps real</p>
      </div>
    </a>
  );
}

// ===== Secció Comerços i Oci =====
function ShopsLeisureExtended() {
  // Todos los servicios de la base de datos, incluyendo los cerrados
  const services = [
    { id: 1, name: "Haribo", description: "Venda de dolços i llaminadures", link: "https://www.haribo.com", ad_path: "https://seeklogo.com/images/H/haribo-logo-62279040B7-seeklogo.com.png", offer: "Enviament gratuit", status: "open" },
    { id: 2, name: "Starbucks", description: "Cafeteria internacional", link: "https://www.starbucks.com", ad_path: "https://images.icon-icons.com/2699/PNG/512/starbucks_logo_icon_170705.png", offer: "Oferta especial en begudes", status: "open" },
    { id: 3, name: "Chanel", description: "Botiga de luxe de cosmètics i moda", link: "https://www.chanel.com", ad_path: "https://1000logos.net/wp-content/uploads/2016/11/Chanel-logo.png", offer: "20% de descompte", status: "open" },
    { id: 4, name: "Farmàcia 1", description: "Farmàcia amb servei 24h", link: "https://www.farmàcia_.com", ad_path: "https://centrocomerciallosangeles.es/wp-content/uploads/2017/06/logo-farmacia.jpg", offer: "Regal amb la teva compra", status: "open" },
    { id: 6, name: "Levis", description: "Botiga de roba texana", link: "https://www.levis.com", ad_path: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Levi%27s_logo.svg/2560px-Levi%27s_logo.svg.png", offer: "2x1 en productes seleccionats", status: "open" },
    { id: 7, name: "Massimo Dutti", description: "Botiga de moda elegant", link: "https://www.massimo_dutti.com", ad_path: "https://r.fashionunited.com/nWvxR2Z7vP9sJeVyII3dQCs_QwmFyLGPSgRzQ9qeHnI/resize:fill:1164:0:0/gravity:ce/quality:70/aHR0cHM6Ly9mYXNoaW9udW5pdGVkLmNvbS9pbWcvdXBsb2FkLzIwMjMvMDYvMDIvbG9nby1tYXNzaW1vLWR1dHRpLWZveXc1a25sLTIwMjMtMDYtMDIucG5n", offer: "Regal amb la teva compra", status: "open" },
    { id: 8, name: "Coffee Pause", description: "Petita cafeteria", link: "https://www.coffee_pause.com", ad_path: "https://img.freepik.com/premium-vector/coffee-cup-icon-coffee-break-text_667176-307.jpg", offer: "2x1 en productes seleccionats", status: "open" },
    { id: 9, name: "Nike", description: "Botiga d'esport i roba esportiva", link: "https://www.nike.com", ad_path: "https://www.liderlogo.es/wp-content/uploads/2022/12/pasted-image-0.png", offer: "2x1 en productes seleccionats", status: "open" },
    { id: 10, name: "Sephora", description: "Perfumeria i cosmètics", link: "https://www.sephora.com", ad_path: "https://1000logos.net/wp-content/uploads/2018/08/Sephora-Logo.png", offer: "Oferta especial en begudes", status: "open" },
    { id: 11, name: "Mc Donald's", description: "Restaurant de menjar ràpid", link: "https://www.mc_donalds.com", ad_path: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/McDonald%27s_logo.svg/2560px-McDonald%27s_logo.svg.png", offer: "Enviament gratuit", status: "open" },
    { id: 13, name: "Tous", description: "Joieria i accessoris", link: "https://www.tous.com", ad_path: "https://www.integratecnologia.es/sites/default/files/logo-tous_0.png", offer: "20% de descompte", status: "open" },
    { id: 14, name: "Lindt", description: "Xocolateria", link: "https://www.lindt.com", ad_path: "https://upload.wikimedia.org/wikipedia/commons/9/93/Lindt_logo.png", offer: "Regal amb la teva compra", status: "open" },
    { id: 16, name: "Adidas", description: "Botiga d'esport i roba esportiva", link: "https://www.adidas.com", ad_path: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg", offer: "Regal amb la teva compra", status: "open" },
    { id: 17, name: "H&M", description: "Botiga de moda", link: "https://www.hm.com", ad_path: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/2560px-H%26M-Logo.svg.png", offer: "2x1 en productes seleccionats", status: "open" },
  ];

  const [showRatings, setShowRatings] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const handleViewRatings = (serviceName) => {
    alert(`Veure valoracions per a ${serviceName}`);
  };

  const handleRateService = (serviceName) => {
    alert(`Valorar el servei de ${serviceName}`);
  };

  return (
    <section className="shops-leisure-extended">
      <h2>Comerços i Oci</h2>
      <p>Consulta els comerços i oci de l'aeroport per descobrir ofertes i serveis.</p>
      <div className="carousel">
        {services.map((service) => (
          <div key={service.id} className={`shop-card${service.status === 'closed' ? ' closed' : ''}`}>
            <a href={service.link} target="_blank" rel="noopener noreferrer">
              <img src={service.ad_path} alt={service.name} />
            </a>
            <h4>{service.name}</h4>
            <p>{service.description}</p>
            {service.offer && <p><strong>Oferta:</strong> {service.offer}</p>}
            {service.status === 'closed' && <p style={{color: 'red', fontWeight: 'bold'}}>Tancat</p>}
            <div className="shop-card-buttons">
              <button onClick={() => { setSelectedServiceId(service.id); setShowRatings(true); }}>Veure Valoracions</button>
              <button onClick={() => { setSelectedServiceId(service.id); setShowCreate(true); }}>Valorar</button>
            </div>
          </div>
        ))}
      </div>
      {showRatings && (
        <ServiceRatings serviceId={selectedServiceId} onClose={() => setShowRatings(false)} />
      )}
      {showCreate && (
        <CreateRatings serviceId={selectedServiceId} onClose={() => setShowCreate(false)} />
      )}
    </section>
  );
}

// ===== Componente Principal =====
function MainPage() {
  return (
    <div className="mainpage-container">
      <Header />
      <MapSection />
      <CarReservation />
      <ShopsLeisureExtended />
      <FlightInfo />
    </div>
  );
}

export default MainPage;

