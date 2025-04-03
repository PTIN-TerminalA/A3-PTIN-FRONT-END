import {Link} from 'react-router-dom';

function Button({label, type, url}) {
    return (
        <Link to={url} className={type}>
            {label}
        </Link>
    );
  }
  
  export default Button;