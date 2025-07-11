"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  Contact,
  FullContact,
} from "../../../../packages/shared-types/user-data";

import Header from "../../components/Header";
import ContactList from "../../components/Contact/List/ContactList";
import ContactDetails from "../../components/Contact/ContactDetails";
import ContactCreate from "../../components/Contact/ContactCreate";
import ContactEdit from "../../components/Contact/ContactEdit";
import ConfirmModal from "../../components/ConfirmModal";

import { getFetchToken } from "../../lib/getFetchToken";
import ContactDashboard from "backend/components/Contact/ContactDashboard";
import NetworkGraph from "backend/components/NetworkGraph/NetworkGraph";

export default function Dashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [fullContactDetails, setFullContactDetails] =
    useState<FullContact | null>(null);

  // States:
  //   selectedContact -> if true, show the details and allow editing
  //   isEditing -> edit was clicked, with the selected contact
  //   isCreating -> create was clicked, selected contact is now null

  // when loaded, get the user and their contacts
  useEffect(() => {
    fetchContacts();
  }, []);

  // Fetch all the contacts then update the contacts variable
  const fetchContacts = async () => {
    try {
      const session = await supabase.auth.getSession();
      const token = await getFetchToken();

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
    setIsCreating(false);
    setIsEditing(false);
  };

  // handles creating a contact given the contact data
  const createContact = async (contactData: Partial<FullContact> | null) => {
    if (!contactData) {
      console.error("Create contact recieved no data");
      return;
    }

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
    setIsEditing(false);
    setIsCreating(false);
    setSelectedContact(newContact);

    // TODO make a non-intrusive popup confirming the contact `if (res.ok)`
  };

  // handle a contact being edited- the submitting/logic after part
  const handleEditContact = async (
    updatedData: Partial<FullContact> | undefined
  ) => {
    if (!selectedContact) return;
    if (!updatedData) return;

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
    console.log("discard");
    setIsEditing(false);
    setIsCreating(false);
  };

  const toggleCreateContact = async () => {
    setSelectedContact(null);
    setIsCreating(true);
  };

  const toggleDashboard = async () => {
    setIsCreating(false);
    setIsEditing(false);
    setSelectedContact(null);
  };

  const promptDelete = () => {
    if (!selectedContact) return;
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    if (!selectedContact) return;

    setShowConfirmModal(false); // hide modal

    const token = await getFetchToken();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contacts/${selectedContact.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      await fetchContacts();
      setSelectedContact(null);
    } else {
      console.error("Delete failed:", await res.text());
    }
  };

  const fetchAllContactDetails = async () => {
    try {
      const token = await getFetchToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contacts/${selectedContact?.id}/full`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const data: FullContact = await res.json();

      setFullContactDetails(data);
      return data;
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    }
  };

  return (
    <>
      <Header />
      <div
        className="app-container"
        // style={{ display: "flex", height: "100vh" }}
      >
        <div className="sidebar" style={{ backgroundColor: "var(--white)" }}>
          <ContactList
            contacts={contacts}
            onSelect={setSelection}
            selectedContactId={selectedContact?.id || ""}
          />
        </div>
        <div className="main">
          {selectedContact ? (
            isEditing ? (
              <ContactEdit
                contactData={fullContactDetails!}
                onSuccess={handleEditContact}
                onDiscard={discardEditedContact}
                onDelete={promptDelete}
              />
            ) : (
              <ContactDetails
                contactId={selectedContact.id}
                onEdit={editSelectedContact}
                onCreate={toggleCreateContact}
                toggleDashboard={toggleDashboard}
                fetchAllContactDetails={fetchAllContactDetails}
              />
            )
          ) : isCreating ? (
            <ContactCreate
              onSubmit={async (contactData) => {
                createContact(contactData);
              }}
              onDiscard={discardEditedContact}
            />
          ) : (
            <NetworkGraph />
            // <ContactDashboard onCreate={toggleCreateContact} />
          )}
        </div>
      </div>
      {showConfirmModal && (
        <ConfirmModal
          message={`Are you sure you want to delete ${selectedContact?.first_name} ${selectedContact?.last_name}?`}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </>
  );
}
