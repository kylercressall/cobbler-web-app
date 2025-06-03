// Top-bar header for logo
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

import { getFetchToken } from "../lib/getFetchToken";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    // get the users username and set it
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        fetchUsername();
      } else {
        throw new Error("Failed to find logged in user");
      }
    };

    const fetchUsername = async (): Promise<string> => {
      const token = await getFetchToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/name`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch username");
      }

      const { name } = await res.json();
      if (name) setUsername(name);
      return name;
    };

    loadUser();
  }, []);

  return (
    <div className="top-bar">
      <h1>Dashboard</h1>
      {user ? (
        <p>Welcome, {username ? username : user.email}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
