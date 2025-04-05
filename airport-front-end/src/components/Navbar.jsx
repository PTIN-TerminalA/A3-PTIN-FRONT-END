import './navbar.css';

import Button from "./Button.jsx";

function Navbar() {
    return (
      <div className="navbar">
        <div className = "navbar-titlelogo">
          <img src="/src/logo.jpeg" className="navbar-logo" />
          <Button label="Vilanova Intelligent Airport" type="navbar-title" />
        </div>

        <div className="center-button">
          <Button label="Contacta amb nosaltres" type="navbar-button" />
        </div>
        
        <div className="navbar-butons">
          {/* Muestra los botones solo si estás en la página de inicio */}
          {location.pathname === "/" ? (
                <div className="navbar-butons">
                    <Button label="Iniciar Sessió" type="navbar-button" url="/register"/>
                    <Button label="Registrar-se" type="navbar-button" url="login"/>
                </div>
            ) : (
                <div className="navbar-butons">
                    <Button label="Cerrar Sesion" type="navbar-button" url="/" />
                </div>
            )}
        </div>
      </div>
    );
  }
  
  export default Navbar;