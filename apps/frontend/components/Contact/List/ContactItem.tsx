import { Contact } from "../../../types/user-data";

interface ContactItemProps {
  contact: Contact;
  onSelect: (contact: Contact) => void;
}

export default function ContactItem({ contact, onSelect }: ContactItemProps) {
  return (
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
  );
}
