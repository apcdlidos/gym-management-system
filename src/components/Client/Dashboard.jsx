import { useState, useEffect } from "react";
import "../../styles/Dashboard.css";
import Navbar from "../Navbar";
import Schedule from "./Schedule";
import Subscription from "./Subscription";

const renderPage = (path) => {
  switch (path) {
    case "/schedule":
      return <Schedule />;
    case "/subscription":
      return <Subscription />;
    default:
      return <>Dashboard</>;
  }
};

const navigate = (setCurrentPage, path) => {
  window.history.pushState({}, "", path);
  setCurrentPage(path);
};

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  });

  return (
    <div className="container">
      <Navbar>
        <button
          className="navbutton"
          type=""
          onClick={() => {
            navigate(setCurrentPage, "/dashboard");
          }}
        >
          Dashboard
        </button>
        <button
          type=""
          className="navbutton"
          onClick={() => {
            navigate(setCurrentPage, "/schedule");
          }}
        >
          Trainer Schedules
        </button>
        <button
          type=""
          className="navbutton"
          onClick={() => {
            navigate(setCurrentPage, "/subscription");
          }}
        >
          Subscription
        </button>
      </Navbar>
      <main>{renderPage(currentPage)} </main>
    </div>
  );
};
export default Dashboard;
