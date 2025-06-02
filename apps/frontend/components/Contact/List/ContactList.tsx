// Contact List displays all the selectable contacts in the left colmn
import { Contact } from "../../../types/user-data";
import ContactItem from "./ContactItem";

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
        <ContactItem
          key={contact.id}
          contact={contact}
          onSelect={() => onSelect(contact)}
        />
      ))}
    </div>
  );
}
