import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

import { Contact } from "../../types/user-data";
import ContactHeader from "./ContactHeader";
import { getFetchToken } from "../../lib/getFetchToken";

export default function ContactEdit({
  contactData,
  onSuccess,
  onDiscard,
  onDelete,
}: {
  contactData: Partial<Contact>;
  onSuccess: (contactData: Partial<Contact>) => void;
  onDiscard: () => void;
  onDelete: () => void;
}) {
  const [contact, setContact] = useState<Partial<Contact>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (contactData) setContact(contactData);
  }, [contactData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(contact);
  };

  return (
    <div>
      <ContactHeader>
        <button type="submit" form="contact-form">
          Confirm Edit
        </button>
        <button type="submit" onClick={onDiscard}>
          Discard Changes
        </button>
        <button onClick={onDelete}>Delete Contact</button>
      </ContactHeader>
      <form
        id="contact-form"
        className="contact-form main-content"
        onSubmit={handleSubmit}
      >
        <div className="form-row">
          <label htmlFor="first_name">First Name:</label>
          <input
            name="first_name"
            value={contact.first_name ?? ""}
            onChange={handleChange}
            placeholder="first_name"
          />
          <label htmlFor="last_name">Last Name:</label>
          <input
            name="last_name"
            value={contact.last_name ?? ""}
            onChange={handleChange}
            placeholder="last_name"
          />
        </div>

        <div className="form-row">
          <label htmlFor="email">Email:</label>
          <input
            name="email"
            value={contact.email ?? ""}
            onChange={handleChange}
            placeholder="Email"
          />{" "}
        </div>
        <div className="form-row">
          <label htmlFor="phone">Phone:</label>
          <input
            name="phone"
            value={contact.phone ?? ""}
            onChange={handleChange}
            placeholder="Phone"
          />
        </div>
        <div className="form-row">
          <label htmlFor="organization">Organization:</label>
          <input
            name="organization"
            value={contact.organization ?? ""}
            onChange={handleChange}
            placeholder="Organization"
          />
        </div>
        <div className="form-row">
          <label htmlFor="position">Position:</label>
          <input
            name="position"
            value={contact.position ?? ""}
            onChange={handleChange}
            placeholder="Position"
          />
        </div>
      </form>
    </div>
  );
}
