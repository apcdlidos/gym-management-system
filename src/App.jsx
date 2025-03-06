import { createContext, useState, useEffect } from "react";
import "./App.css";
import Dashboard from "./components/Client/Dashboard";
import supabase from "./utils/supabase";

export const UserContext = createContext(null);

const fetchUser = async (setUser) => {
  const { data: user, error: error } = await supabase
    .from("client")
    .select()
    .eq("id", 1)
    .single();

  if (!user) {
    console.log("no user found");
    return;
  }
  setUser(user);
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(setUser);
  }, []);

  if (user) {
    console.log(user.membership_status);
  }

  // const currentUser = {
  //   id: 1,
  //   first_name: "Ethan",
  //   last_name: "Palconan",
  //   membership_status: "active",
  // };

  return user ? (
    <UserContext.Provider value={user}>
      <Dashboard />
    </UserContext.Provider>
  ) : (
    <div>Loading...</div>
  );
}

export default App;
