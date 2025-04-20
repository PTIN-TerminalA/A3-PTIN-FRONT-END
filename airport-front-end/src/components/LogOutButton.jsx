import {Link, useNavigate} from 'react-router-dom';
import Cookies from "js-cookie"

function LogOutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove("token");
        navigate("/")
    }
    return (
        <button onClick={handleLogout} className="btn-secondary">
        Tanca la sessió
        </button>
    );
  }
  
  export default LogOutButton;