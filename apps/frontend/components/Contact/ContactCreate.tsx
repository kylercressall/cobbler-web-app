// Contact form is the form used to create/edit contacts
import { useState, useEffect } from "react";
import { Contact } from "backend/types/user-data";

interface ContactCreateProps {
  contact?: Contact;
  onSubmit: (contactData: Partial<Contact>) => void;
}

export default function ContactCreate({
  contact,
  onSubmit,
}: ContactCreateProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (contact) {
      setName(contact.name || "");
      setEmail(contact.email || "");
      setPhone(contact.phone || "");
    } else {
      setName("");
      setEmail("");
      setPhone("");
    }
  }, [contact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, phone });
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="tel"
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button type="submit">
        {contact ? "Save Changes" : "Create Contact"}
      </button>
    </form>
  );
}
