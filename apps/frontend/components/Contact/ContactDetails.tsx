// Contact Details is the right pane that displays the details of a given contact
import { Contact } from "../../types/user-data";

import ContactHeader from "./ContactHeader";

interface ContactDetailsProps {
  contact: Contact;
  onEdit: () => void;
  onCreate: () => void;
  toggleDashboard: () => void;
}

export default function ContactDetails({
  contact,
  onEdit,
  onCreate,
  toggleDashboard,
}: ContactDetailsProps) {
  return (
    <div>
      <ContactHeader>
        <button onClick={onEdit}>Edit Contact</button>
        <button onClick={onCreate}>Create New Contact</button>
        <button onClick={toggleDashboard}>View Dashboard</button>
      </ContactHeader>

      <div className="main-content">
        <h2>{contact.name}</h2>
        <p>Email: {contact.email}</p>
        <p>Phone: {contact.phone}</p>
        <p>Organization: {contact.organization}</p>
        <p>Position: {contact.position}</p>
        <img src={contact.avatar_url as string} alt="" />
      </div>
    </div>
  );
}
