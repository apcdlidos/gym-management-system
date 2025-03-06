import { useState, useEffect, useContext } from "react";
import supabase from "../../utils/supabase";
import { UserContext } from "../../App";
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
      return <Default />;
  }
};

const Default = () => {
  const { user } = useContext(UserContext);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);

  useEffect(() => {
    const fetchSubscription = async (setState) => {
      const { data: subscription, error } = await supabase
        .from("membership")
        .select()
        .eq("client_id", user.id);
      if (error) {
        setState(null);
      }
      setState(subscription[0]);
    };

    fetchSubscription(setSubscriptionInfo);
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h2>Dashboard</h2>
      <div className="default-container">
        <div>
          <span>
            <p>USERNAME</p>
            {user.first_name} {user.last_name}
          </span>
          <span>
            <p>EMAIL</p>
            {user.email}
          </span>
          <span>
            <p>PHONE NUMBER</p>
            {user.phone}
          </span>

          <span>
            <p>JOIN DATE</p>
            {new Date(user.created_at).toISOString().slice(0, 10)}
          </span>
        </div>
        {subscriptionInfo && (
          <div>
            <span>
              <p>MEMBERSHIP STATUS</p>
              {user.membership_status}
            </span>
            <span>
              <p>ANNUAL EXPIRATION </p>
              {subscriptionInfo.expiration_date}
            </span>
            <span>
              <p>MONTHLY EXPIRATION </p>
              {subscriptionInfo.monthly_due_date}
            </span>
          </div>
        )}
      </div>
    </>
  );
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
