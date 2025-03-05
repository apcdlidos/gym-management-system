import { useState, useEffect } from "react";

import supabase from "../../utils/supabase";

async function getSchedule(setSchedule) {
  const { data: schedule } = await supabase.from("schedule").select();

  if (schedule.length > 0) {
    setSchedule(schedule);
  }
}
function Schedule() {
  const [schedule, setSchedule] = useState([]);
  useEffect(() => {
    getSchedule(setSchedule);
  }, []);

  return (
    <div>
      {schedule.map((sched) => (
        <li key={sched.id}>{sched.available_start}</li>
      ))}
    </div>
  );
}

export default Schedule;
