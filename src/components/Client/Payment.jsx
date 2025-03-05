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
      return;
    }
    console.log("Payment successful");
    console.log("Proceeding with the Transaction");
    confirmTransaction();
    handleStateReset();
  };

  return (
    <div className="payment-overlay">
      <div className="payment-modal">
        <h3>Payment Confirmation</h3>
        <p> Amount: ${paymentInfo.amount}</p>
        <label htmlFor="credit-card">Credit Card</label>
        <input
          name="paymentMethod"
          onChange={(e) => {
            console.log(e.target.id);
            setSelectedMethod(e.target.id);
          }}
          type="radio"
          id="credit-card"
        />

        <label htmlFor="debit-card">Debit Card</label>
        <input
          name="paymentMethod"
          onChange={(e) => {
            console.log(e.target.id);
            setSelectedMethod(e.target.id);
          }}
          type="radio"
          id="debit-card"
        />
        <label htmlFor="cash">Cash</label>
        <input
          name="paymentMethod"
          onChange={(e) => {
            console.log(e.target.id);
            setSelectedMethod(e.target.id);
          }}
          type="radio"
          id="cash"
        />
        <label htmlFor="e-wallet">E-Wallet</label>
        <input
          name="paymentMethod"
          onChange={(e) => {
            console.log(e.target.id);
            setSelectedMethod(e.target.id);
          }}
          type="radio"
          id="e-wallet"
        />

        <button onClick={() => handlePayment()} className="payment-button">
          Confirm Payment
        </button>
      </div>
    </div>
  );
};

export default Payment;
