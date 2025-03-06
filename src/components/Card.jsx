import "../styles/Card.css";

const Card = ({ label, description, handleClick, optClass = "" }) => {
  return (
    <div className={"card " + optClass}>
      <h4> {label}</h4>
      <p>{description}</p>
      <button onClick={handleClick}>Select</button>
    </div>
  );
};

export default Card;
