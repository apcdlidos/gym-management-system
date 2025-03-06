import { useState, useContext } from "react";
import "../../styles/Subscription.css";
import supabase from "../../utils/supabase";
import Card from "../Card";
import Payment from "./Payment";
import { UserContext } from "../../App";

const fetchCurrentSubscription = async (client_id) => {
  const { data: subscription, error } = await supabase
    .from("membership")
    .select()
    .eq("client_id", client_id)
    .single();
  if (error) {
    console.error(error);
    return null;
  }
  return subscription;
};

const availSubscription = async (subscription, info) => {
  if (subscription == "day_pass") {
    const { dayPassError } = await supabase
      .from(subscription)
      .insert({ ...info });
    if (dayPassError) {
      throw dayPassError;
    } else {
      console.log("Successfully availed Day Pass Subscription");
    }
    return;
  }

  const { availError } = await supabase
    .from(subscription)
    .upsert({ ...info }, { onConflict: "client_id" });
  if (availError) {
    throw availError;
  }

  const { error: updateError } = await supabase
    .from("client")
    .update({ membership_status: "active" })
    .eq("id", info.client_id);

  if (updateError) {
    throw updateError;
  }

  console.log("Successfully availed Membership Subscription");
};

const Subscription = () => {
  const { user, setUser } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [selectedSubscription, setSelectedSubscription] = useState("");
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [paymentConfirmation, setPaymentConfirmation] = useState(false);

  const getOneMonthFromNow = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date;
  };

  const resetState = () => {
    setSelectedSubscription(null);
    setPaymentInfo(null);
    setPaymentConfirmation(false);
    setSelectedSubscription("");
  };

  if (!user) {
    return <div>Loading...</div>; // or any other fallback UI
  }

  return (
    <div className="subscription-container">
      <div className="subscription-list">
        <Card
          optClass={`${user.membership_status !== "active" ? "" : "unavailable"} `}
          label="Annual Subscription + Monthly Plan"
          description={"$9999.99"}
          handleClick={() => {
            if (user.membership_status == "active") {
              console.log("Not applicable to current user");
              return;
            }
            const annualInfo = {
              client_id: user.id,
              join_date: new Date(),
              expiration_date: new Date(
                new Date().setFullYear(new Date().getFullYear() + 1),
              ),
              monthly_due_date: getOneMonthFromNow(),
              has_paid: true,
            };

            const paymentInfo = {
              client_id: user.id,
              amount: 9999.99,
              payment_type: "initial/annual-fee",
            };
            setPaymentConfirmation(true);
            setSubscriptionInfo(annualInfo);
            setPaymentInfo(paymentInfo);
            setSelectedSubscription("membership");
          }}
        ></Card>
        <Card
          optClass={`${user.membership_status === "active" ? "" : "unavailable"} `}
          label="Re-new Membership"
          description={"99.99"}
          handleClick={async () => {
            if (
              user.membership_status == "expired" ||
              user.membership_status == "none"
            ) {
              console.log("Not applicable to current user");
              return;
            }

            const currentSubscription = await fetchCurrentSubscription(user.id);
            const { monthly_due_date, has_paid, ...restInfo } =
              currentSubscription;
            await fetchCurrentSubscription(user.id);
            const nextDue = new Date(monthly_due_date);
            nextDue.setMonth(nextDue.getMonth() + 1);

            console.log("curr", new Date(monthly_due_date));
            console.log("next", nextDue);

            const monthlyInfo = {
              ...restInfo,
              monthly_due_date: nextDue,
              has_paid: true,
            };

            const paymentInfo = {
              client_id: user.id,
              amount: 99.99,
              payment_type: "monthly-fee",
            };
            setPaymentConfirmation(true);
            setSubscriptionInfo(monthlyInfo);
            setPaymentInfo(paymentInfo);
            setSelectedSubscription("membership");
          }}
        ></Card>
        <Card
          optClass={`${user.membership_status == "active" ? "unavailable" : ""} `}
          label="Day Pass Membership"
          description={"9.99"}
          handleClick={async () => {
            if (user.membership_status == "active") {
              console.log("Not applicable to current user");
              return;
            }

            const dayPassInfo = {
              client_id: user.id,
            };

            const paymentInfo = {
              client_id: user.id,
              amount: 9.99,
              payment_type: "day-pass-fee",
            };
            setPaymentConfirmation(true);
            setSubscriptionInfo(dayPassInfo);
            setPaymentInfo(paymentInfo);
            setSelectedSubscription("day_pass");
          }}
        ></Card>
      </div>
      {paymentConfirmation && (
        <Payment
          handleStateReset={resetState}
          confirmTransaction={() =>
            availSubscription(selectedSubscription, subscriptionInfo)
          }
          setError={setError}
          paymentInfo={paymentInfo}
        ></Payment>
      )}
    </div>
  );
};

export default Subscription;
