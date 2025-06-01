"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Contact } from "../../types/user-data";

import ContactList from "../../components/ContactList";
import CreateContact from "../../components/CreateContact";
import ContactDetails from "../../components/ContactDetails";
import ContactForm from "backend/components/ContactForm";

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

  const getFetchToken = async () => {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    if (!token) {
      console.error("Not logged in");
      return "";
    }

    return token;
  };

  // get the user and their contacts
  useEffect(() => {
    // get the users username and set it
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

  const createContact = async (contactData: Partial<Contact>) => {
    const token = await getFetchToken();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contacts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contactData),
      }
    );

    // grab the created contact from API
    const newContact = await res.json();

    await fetchContacts();
    setSelectedContact(newContact);

    // make a non-intrusive popup confirming the contact

    // if (res.ok) {
    //   await fetchContacts();
    //   alert("Contact created!");
    // } else {
    //   alert("Failed to create contact");
    // }
  };

  const openCreateForm = async () => {
    setSelectedContact(null);
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
          <button onClick={openCreateForm}>Create Contact</button>
          <ContactList contacts={contacts} onSelect={setSelection} />
        </div>
        <div className="main" style={{ flex: 1, padding: "1rem" }}>
          {" "}
          {selectedContact ? (
            <ContactDetails contact={selectedContact} />
          ) : (
            <ContactForm
              onSubmit={async (contactData) => {
                createContact(contactData);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}
