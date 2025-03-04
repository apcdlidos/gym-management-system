import { useState, useEffect } from "react";

import supabase from "../utils/supabase";

async function getSchedules(setTodos) {
  const { data: schedules } = await supabase.from("schedules").select();

  if (schedules.length > 0) {
    setTodos(schedules);
  }
}
function Dashboard() {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    getSchedules(setSchedules);
  }, []);

  return (
    <div>
      {schedules.map((sched) => (
        <li key={sched.id}>{sched.start_time}</li>
      ))}
    </div>
  );
}

export default Dashboard;
