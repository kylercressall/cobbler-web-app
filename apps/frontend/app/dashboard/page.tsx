"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? <p>Welcome, {user.email}</p> : <p>Loading...</p>}
    </div>
  );
}
