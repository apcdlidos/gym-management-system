import { useState, useEffect } from "react";
import Schedule from "../components/Client/Schedule";

const renderPage = (path) => {
  switch (path) {
    case "/schedule":
      return <Schedule />;
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
    <div>
      <ul>
        <li>
          <button
            type=""
            onClick={() => {
              navigate(setCurrentPage, "/dashboard");
            }}
          >
            Dashboard
          </button>
        </li>
        <li>
          <button
            type=""
            onClick={() => {
              navigate(setCurrentPage, "/schedule");
            }}
          >
            Schedule
          </button>
        </li>
      </ul>
      <div>{renderPage(currentPage)} </div>
    </div>
  );
};
export default Dashboard;
