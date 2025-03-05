import { useState, useEffect } from "react";
import "../../styles/Subscription.css";
import supabase from "../../utils/supabase";
import Card from "../Card";
import Payment from "./Payment";

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
  const { error } = await supabase
    .from(subscription)
    .upsert({ ...info }, { onConflict: "client_id" });
  if (error) {
    console.error(error);
  } else {
    console.log("Successfully subscribed");
  }
};

const Subscription = () => {
  const [user, setUser] = useState({
    id: 1,
    first_name: "Ethan",
    last_name: "Palconan",
    membership_status: "none",
  });
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

  return (
    <div className="subscription-container">
      <div className="subscription-list">
        <Card
          optClass={`${user.membership_status}`}
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
          label="Re-new Membership"
          description={"99.99"}
          handleClick={async () => {
            const currentSubscription = await fetchCurrentSubscription(user.id);
            if (
              !currentSubscription ||
              user.membership_status == "expired" ||
              user.membership_status == "none"
            ) {
              console.log("Not applicable to current user");
              return;
            }
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
