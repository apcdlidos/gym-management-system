import { useState, useEffect } from "react";
import Schedule from "../components/Client/Schedule";

const renderPage = (path) => {
  console.log(path);
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
  console.log(path);
};

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(window.location.pathname);

  console.log(currentPage);

  useEffect(() => {
    const handlePopState = (e) => {
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
