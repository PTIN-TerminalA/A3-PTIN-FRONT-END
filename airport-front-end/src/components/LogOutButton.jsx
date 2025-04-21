import {Link, useNavigate} from 'react-router-dom';
import "/src/components/assets/LogOutButton.css"
import sortir from "/src/pages/images/apagar.png";
import Cookies from "js-cookie"

function LogOutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove("token");
        navigate("/")
    }
    return (
        <button onClick={handleLogout} className="btn-secondary">
            <img src={sortir} alt="Sortir" />
        </button>
    );
  }
  
  export default LogOutButton;