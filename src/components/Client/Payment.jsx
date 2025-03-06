import { useState, useEffect } from "react";

import "../../styles/Payment.css";
import supabase from "../../utils/supabase";

const Payment = ({
  handleStateReset,
  confirmTransaction,
  paymentInfo,
  setError,
}) => {
  const [selectedMethod, setSelectedMethod] = useState("");

  const handlePayment = async () => {
    const { error } = await supabase
      .from("payment")
      .insert({ ...paymentInfo, payment_method: selectedMethod });
    if (error) {
      console.error(error);
      setError(error.message);
      return;
    }
    console.log("Payment successful");
    console.log("Proceeding with the Transaction");
    confirmTransaction();
    handleStateReset();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target == e.currentTarget) {
          handleStateReset();
        }
      }}
      className="payment-overlay"
    >
      <div className="payment-modal">
        <h4>Payment Confirmation</h4>
        <div className="payment-info">
          <p>Amount</p>
          <h5>${paymentInfo.amount}</h5>
        </div>
        <div className="payment-options">
          <label htmlFor="credit-card">
            <input
              name="paymentMethod"
              onChange={(e) => {
                console.log(e.target.id);
                setSelectedMethod(e.target.id);
              }}
              type="radio"
              id="credit-card"
            />
            Credit Card
          </label>

          <label htmlFor="debit-card">
            <input
              name="paymentMethod"
              onChange={(e) => {
                console.log(e.target.id);
                setSelectedMethod(e.target.id);
              }}
              type="radio"
              id="debit-card"
            />
            Debit Card
          </label>
          <label htmlFor="cash">
            <input
              name="paymentMethod"
              onChange={(e) => {
                console.log(e.target.id);
                setSelectedMethod(e.target.id);
              }}
              type="radio"
              id="cash"
            />
            Cash
          </label>
          <label htmlFor="e-wallet">
            <input
              name="paymentMethod"
              onChange={(e) => {
                console.log(e.target.id);
                setSelectedMethod(e.target.id);
              }}
              type="radio"
              id="e-wallet"
            />
            E-Wallet
          </label>
        </div>
        <button onClick={() => handlePayment()} className="payment-button">
          Confirm Payment
        </button>
      </div>
    </div>
  );
};

export default Payment;
