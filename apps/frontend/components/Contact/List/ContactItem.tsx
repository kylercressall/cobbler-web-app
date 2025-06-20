import { Contact } from "../../../../../packages/shared-types/user-data";

interface ContactItemProps {
  contact: Contact;
  selectedContactId: string;
  onSelect: (contact: Contact) => void;
}

export default function ContactItem({
  contact,
  selectedContactId,
  onSelect,
}: ContactItemProps) {
  return (
    <div
      key={contact.id}
      className={`contact-item ${
        selectedContactId === contact.id ? "selected" : ""
      }`}
      onClick={() => onSelect(contact)}
      style={{
        cursor: "pointer",
        padding: "8px",
        borderBottom: "1px solid #eee",
      }}
    >
      {contact.first_name} {contact.last_name}
    </div>
  );
}
