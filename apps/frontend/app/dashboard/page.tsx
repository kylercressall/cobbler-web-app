"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Contact } from "../../types/user-data";

import ContactList from "../../components/ContactList";
import CreateContact from "../../components/CreateContact";
import ContactDetails from "../../components/ContactDetails";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState<string>("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const fetchContacts = async () => {
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) {
        console.error("Not logged in");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contacts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid API response");

      setContacts(data);
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    }
  };

  // get the user and their contacts
  useEffect(() => {
    // get the users username and set it
    const fetchUsername = async (): Promise<string> => {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      if (!token) {
        console.error("Not logged in");
        return "";
      }

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
      console.log(name);
      if (name) setUsername(name);
      return name;
    };

    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      fetchUsername();

      if (user) {
        fetchContacts();
      }
    };
    loadUser();
  }, []);

  // this is run by the contact list to change which is selected
  const setSelection = (contact: Contact) => {
    console.log("Onclick:", contact);
    setSelectedContact(contact);
  };

  return (
    <>
      <div className="top-bar">
        <h1>Dashboard</h1>
        {user ? (
          <p>Welcome, {username ? username : user.email}</p>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div
        className="app-container"
        style={{ display: "flex", height: "100vh" }}
      >
        <div
          className="sidebar"
          style={{ width: "300px", borderRight: "1px solid #ccc" }}
        >
          <ContactList contacts={contacts} onSelect={setSelection} />
        </div>
        <div className="main" style={{ flex: 1, padding: "1rem" }}>
          {" "}
          {/* <CreateContact onSuccess={fetchContacts} /> */}
          {selectedContact ? (
            <ContactDetails contact={selectedContact} />
          ) : (
            <p>Select a contact to view details</p>
          )}
        </div>
      </div>
    </>
  );
}
