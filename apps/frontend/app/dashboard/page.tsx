"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Contact } from "../../types/user-data";

import Header from "../../components/Header";
import ContactList from "../../components/Contact/List/ContactList";
import ContactDetails from "../../components/Contact/ContactDetails";
import ContactCreate from "../../components/Contact/ContactCreate";
import ContactEdit from "../../components/Contact/ContactEdit";

import { getFetchToken } from "../../lib/getFetchToken";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState<string>("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // when loaded, get the user and their contacts
  useEffect(() => {
    fetchContacts();
  }, []);

  // Fetch all the contacts then update the contacts variable
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

  // handles clicking on contacts and setting it to selected (to show details on the right pane)
  const setSelection = (contact: Contact) => {
    setSelectedContact(contact);
  };

  // handles creating a contact given the contact data
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

    // TODO make a non-intrusive popup confirming the contact `if (res.ok)`
  };

  // handle a contact being edited- the submitting/logic after part
  const handleEditContact = async (updatedData: Partial<Contact>) => {
    console.log("Updated Data:", updatedData);

    if (!selectedContact) return;

    console.log(
      "patch url:",
      `process.env.NEXT_PUBLIC_API_BASE_URL}/api/contacts/${
        selectedContact!.id
      }`
    );

    const token = await getFetchToken();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contacts/${
        selectedContact!.id
      }`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      }
    );

    const updatedContact = await res.json();
    await fetchContacts();
    setSelectedContact(updatedContact);
    setIsEditing(false);
  };

  const editSelectedContact = () => {
    setIsEditing(true);
  };

  const discardEditedContact = () => {
    setIsEditing(false);
  };

  const omitIdFields = (contact: Contact): Omit<Contact, "id" | "user_id"> => {
    const { id, user_id, ...rest } = contact;
    return rest;
  };

  return (
    <>
      <Header />
      <div
        className="app-container"
        style={{ display: "flex", height: "100vh" }}
      >
        <div
          className="sidebar"
          style={{ width: "300px", borderRight: "1px solid #ccc" }}
        >
          <button onClick={async () => setSelectedContact(null)}>
            Create Contact
          </button>
          <ContactList contacts={contacts} onSelect={setSelection} />
        </div>
        <div className="main" style={{ flex: 1, padding: "1rem" }}>
          {selectedContact ? (
            isEditing ? (
              <ContactEdit
                contactData={omitIdFields(selectedContact)}
                onSuccess={handleEditContact}
                onDiscard={discardEditedContact}
              />
            ) : (
              <ContactDetails
                contact={selectedContact}
                onEdit={editSelectedContact}
              />
            )
          ) : (
            <ContactCreate
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
