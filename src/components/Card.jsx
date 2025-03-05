import "../styles/Card.css";

const Card = ({ label, description, handleClick, optClass }) => {
  return (
    <div className={"card " + optClass}>
      <h2> {label}</h2>
      <p>{description}</p>
      <button onClick={handleClick}>Select</button>
    </div>
  );
};

export default Card;
