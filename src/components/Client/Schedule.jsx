import { useState, useEffect } from "react";
import "../../styles/Schedule.css";
import supabase from "../../utils/supabase";
import Card from "../Card";

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
  const { data: schedule } = await supabase
    .from("schedule")
    .select()
    .eq("trainer_id", trainer_id);

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

const Schedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  useEffect(() => {
    getTrainer(setTrainers);
  }, []);

  return (
    <div className="card-container">
      {trainers.map((trainer) => (
        <Card
          key={trainer.id}
          label={trainer.first_name}
          description={""}
          handleClick={() => {
            setSelectedTrainer(trainer);
            getSchedule(setSchedule, trainer.id);
          }}
        />
      ))}
      {selectedTrainer && (
        <div className={"selectedTrainer"}>
          {selectedTrainer.id}
          <ul>
            {schedule.map((schedule) => (
              <li key={schedule.id}>
                {formatDate(schedule.available_start)} -
                {formatDate(schedule.available_end)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Schedule;
