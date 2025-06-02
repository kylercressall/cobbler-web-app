import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

import { Contact } from "../../types/user-data";

export default function ContactEdit({
  contactData,
  onSuccess,
  onDiscard,
}: {
  contactData: Partial<Contact>;
  onSuccess: (contactData: Partial<Contact>) => void;
  onDiscard: () => void;
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
    <form className="contact-form" onSubmit={handleSubmit}>
      <input
        name="name"
        value={contact.name ?? ""}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        name="email"
        value={contact.email ?? ""}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="phone"
        value={contact.phone ?? ""}
        onChange={handleChange}
        placeholder="Phone"
      />
      <input
        name="organization"
        value={contact.organization ?? ""}
        onChange={handleChange}
        placeholder="Organization"
      />
      <input
        name="position"
        value={contact.position ?? ""}
        onChange={handleChange}
        placeholder="Position"
      />
      <button type="submit">Confirm Edit</button>
      <button type="submit" onClick={onDiscard}>
        Discard Changes
      </button>
    </form>
  );
}
