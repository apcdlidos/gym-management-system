import { useContext, Children } from "react";
import { UserContext } from "../App";
import "../styles/Navbar.css";

const Navbar = ({ children }) => {
  const { user, setUser } = useContext(UserContext);

  if (!user) {
    return <div> Loading..</div>;
  }

  return (
    <header className="navbar">
      <div className="navtitle">
        <small>Welcome!</small>
        <h5>
          {user.first_name} {user.last_name}
        </h5>
      </div>
      <hr />
      <div className="navlinks">
        {Children.map(children, (child) => {
          return <li className="navlink">{child}</li>;
        })}
      </div>
    </header>
  );
};

export default Navbar;
