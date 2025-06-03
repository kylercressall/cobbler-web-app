// Contact List displays all the selectable contacts in the left colmn
import { Contact } from "../../../types/user-data";
import ContactItem from "./ContactItem";

interface ContactListProps {
  selectedContactId: string;
  contacts: Contact[];
  onSelect: (contact: Contact) => void;
}

export default function ContactList({
  selectedContactId,
  contacts,
  onSelect,
}: ContactListProps) {
  if (contacts.length === 0) {
    return <p>No contacts found.</p>;
  }

  return (
    <div>
      {contacts.map((contact) => (
        <ContactItem
          key={contact.id}
          contact={contact}
          selectedContactId={selectedContactId || ""}
          onSelect={() => onSelect(contact)}
        />
      ))}
    </div>
  );
}
