// Contact Details is the right pane that displays the details of a given contact
import { Contact } from "../../types/user-data";

interface ContactDetailsProps {
  contact: Contact;
  onEdit: () => void;
}

export default function ContactDetails({
  contact,
  onEdit,
}: ContactDetailsProps) {
  return (
    <div>
      <button onClick={onEdit}>Edit Contact</button>
      <h2>{contact.name}</h2>
      <p>Email: {contact.email}</p>
      <p>Phone: {contact.phone}</p>
      <p>Organization: {contact.organization}</p>
      <p>Position: {contact.position}</p>
      <img src={contact.avatar_url as string} alt="" />
    </div>
  );
}
