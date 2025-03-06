import { useState, useEffect, useContext } from "react";
import supabase from "../../utils/supabase";
import Card from "../Card";
import Payment from "./Payment";
import { UserContext } from "../../App";
import "../../styles/Schedule.css";

const formatDate = (date) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  };
  return new Date(date).toLocaleString("en-US", options);
};

const getSchedule = async (setSchedule, trainer_id) => {
  const { data: trainer_booking } = await supabase
    .from("trainer_booking")
    .select("trainer_id, start_date, end_date, booking_status")
    .eq("trainer_id", trainer_id)
    .eq("booking_status", "active");

  const bookedSchedule = trainer_booking
    .map((item) => `${item.start_date}, ${item.end_date}`)
    .join(", ");
  console.log(bookedSchedule);

  const { data: schedule } = await supabase
    .from("schedule")
    .select()
    .eq("trainer_id", trainer_id)
    .not("available_start, available_end", "in", `(${bookedSchedule})`);

  console.log(schedule);
  if (schedule.length > 0) {
    setSchedule(schedule);
  } else {
    setSchedule([]);
  }
};

const getTrainer = async (setTrainer) => {
  const { data: trainer } = await supabase.from("trainer").select();
  if (trainer) {
    setTrainer(trainer);
  } else {
    return;
  }
};

const bookSchedule = async (info) => {
  const { error } = await supabase.from("trainer_booking").insert(info);
  if (error) {
    console.error(error);
  }
};

const Schedule = () => {
  // const [user, setUser] = useState({
  //   id: 1,
  //   first_name: "Ethan",
  //   last_name: "Palconan",
  //   membership_status: "active",
  // });
  const { user, setUser } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [bookingInfo, setBookingInfo] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [paymentConfirmation, setPaymentConfirmation] = useState(false);

  useEffect(() => {
    getTrainer(setTrainers);
  }, []);

  const resetState = () => {
    setSelectedTrainer(null);
    setSchedule([]);
    setBookingInfo(null);
    setPaymentInfo(null);
    setPaymentConfirmation(false);
  };

  if (!user) {
    return <div>Loading...</div>; // or any other fallback UI
  }
  return user.membership_status == "active" ? (
    <div className="schedule-container">
      {trainers.map((trainer) => (
        <Card
          key={trainer.id}
          label={trainer.first_name}
          description={
            <span className="schedule-description">
              <span className="booking-rate">${trainer.booking_rate}</span>
              <span className="specialization">{trainer.specialization}</span>
              <span className="certification">{trainer.certification}</span>
            </span>
          }
          optClass={"schedule-card"}
          handleClick={() => {
            setSelectedTrainer(trainer);
            getSchedule(setSchedule, trainer.id);
          }}
        />
      ))}
      {selectedTrainer && (
        <div className={"selected-trainer"}>
          <div className={"trainer-info"}>
            <p>{selectedTrainer.id}</p>
            <h5>
              {selectedTrainer.first_name} {selectedTrainer.last_name}
            </h5>
          </div>
          <ul className={"schedule-list"}>
            {schedule.map((schedule) => {
              return (
                <li key={schedule.id}>
                  <button
                    className={"schedule-button"}
                    onClick={() => {
                      const bookingInfo = {
                        client_id: user.id,
                        trainer_id: selectedTrainer.id,
                        start_date: schedule.available_start,
                        end_date: schedule.available_end,
                      };

                      const paymentInfo = {
                        client_id: user.id,
                        amount: selectedTrainer.booking_rate,
                        payment_type: "trainer-fee",
                      };
                      setPaymentConfirmation(true);
                      setBookingInfo(bookingInfo);
                      setPaymentInfo(paymentInfo);
                    }}
                  >
                    {formatDate(schedule.available_start)} -{" "}
                    {formatDate(schedule.available_end)}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {paymentConfirmation && (
        <Payment
          handleStateReset={resetState}
          confirmTransaction={() => bookSchedule(bookingInfo)}
          setError={setError}
          paymentInfo={paymentInfo}
        ></Payment>
      )}
    </div>
  ) : (
    <div>Avail a membership to have personal training sessions</div>
  );
};

export default Schedule;
