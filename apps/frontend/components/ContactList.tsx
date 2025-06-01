import { Contact } from "../types/user-data";

interface ContactListProps {
  contacts: Contact[];
  onSelect: (contact: Contact) => void;
}

export default function ContactList({ contacts, onSelect }: ContactListProps) {
  if (contacts.length === 0) {
    return <p>No contacts found.</p>;
  }

  return (
    <div>
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="contact-item"
          onClick={() => onSelect(contact)}
          style={{
            cursor: "pointer",
            padding: "8px",
            borderBottom: "1px solid #eee",
          }}
        >
          {contact.name}
        </div>
      ))}
    </div>
  );
}
