import React, { useState, useEffect } from 'react';
import '/src/pages/css/mainpage.css';
import LogOutButton from "/src/components/LogOutButton.jsx";
import logo from "/src/pages/images/LogoBlanco.png";
import coche from "/src/pages/images/coche.png";
import avion from "/src/pages/images/avion.png";
import perfil from "/src/pages/images/perfil.png";
import campana from "/src/pages/images/campana.png";
import mapaVirtual from "/src/pages/images/Plano.png";
import chatbotIcon from "/src/pages/images/chatboticon.png";

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
          <button className="minimize-btn" onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? '🗖' : '🗕'}
          </button>
          <button className="close-btn" onClick={onClose}>✕</button>
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

  return (
    <header className="header">
      <div className="logo-section">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="icon-section">
        <button title="Chatbot" onClick={() => setIsChatOpen(!isChatOpen)}>
          <img src={chatbotIcon} alt="Chatbot" />
        </button>
        <button title="Notificacions">
          <img src={campana} alt="Notificacions" />
        </button>
        <button title="Perfil">
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
  return (
    <section className="shops-leisure-extended">
      <h2>Comerços i Oci</h2>
      <p>Consulta els comerços i oci de l'aeroport per descobrir ofertes i serveis.</p>
      <div className="carousel">
        {/* Aquí mantienes las cards como ya las tenías */}
        <div className="shop-card">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/McDonald%27s_logo.svg/2560px-McDonald%27s_logo.svg.png"
            alt="McDonald's"
          />
          <h4>McDonald's</h4>
          <p>Clàssics menús de menjar ràpid per a tots els gustos.</p>
        </div>
        <div className="shop-card">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png"
            alt="Starbucks"
          />
          <h4>Starbucks</h4>
          <p>Cafès i begudes artesanals en un ambient acollidor.</p>
        </div>
        <div className="shop-card">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScwvX8md4fxiyl71dgKvLZAhOK_K3T1y3FJQ&s"
            alt="FCB Store"
          />
          <h4>FCB Store</h4>
          <p>Botiga oficial del FC Barcelona amb productes exclusius.</p>
        </div>
        <div className="shop-card">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/2560px-H%26M-Logo.svg.png"
            alt="H&M"
          />
          <h4>H&M</h4>
          <p>Moda actual per a tota la família a preus assequibles.</p>
        </div>
        <div className="shop-card">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/95/Logo_oficial_cafe.png"
            alt="Cafè Britt"
          />
          <h4>Cafè Britt</h4>
          <p>Especialitats de cafè gourmet en un entorn relaxant.</p>
        </div>
        <div className="shop-card">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Levis-logo-quer.svg/1280px-Levis-logo-quer.svg.png"
            alt="Levi's"
          />
          <h4>Levi's</h4>
          <p>Roba texana icònica amb estil i qualitat reconeguda.</p>
        </div>
      </div>
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

