import "./textbox.css";

function Textbox({title, textin}) {  
    return(
        <div className="text-container">
            <h2 className="text-title">{title}</h2>
            <label className="big-text">
                {textin}
            </label> 
        </div>
    )
}
  
export default Textbox;