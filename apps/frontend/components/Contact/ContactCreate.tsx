// Contact form is the form used to create/edit contacts
import { useState, useEffect } from "react";
import { Contact } from "backend/types/user-data";
import ContactHeader from "./ContactHeader";

interface ContactCreateProps {
  contact?: Contact;
  onSubmit: (contactData: Partial<Contact>) => void;
  onDiscard: () => void;
}

export default function ContactCreate({
  contact,
  onSubmit,
  onDiscard,
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
    <div>
      <ContactHeader>
        <button type="submit" form="create-contact-form">
          {contact ? "Save Changes" : "Create Contact"}
        </button>
        <button onClick={onDiscard}>Discard Contact</button>
      </ContactHeader>

      <form
        id="create-contact-form"
        className="contact-form main-content"
        onSubmit={handleSubmit}
      >
        <h2>Create Contact</h2>
        <div className="form-row">
          <label htmlFor="name">Name:</label>
          <input
            name="name"
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label htmlFor="email">Email:</label>
          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label htmlFor="phone">Phone:</label>
          <input
            name="phone"
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
}
