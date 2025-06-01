import { Contact } from "../types/user-data";

export default function ContactDetails({ contact }: { contact: Contact }) {
  return (
    <div>
      <h2>{contact.name}</h2>
      <p>Email: {contact.email}</p>
      <p>Phone: {contact.phone}</p>
      <p>Organization: {contact.organization}</p>
      <p>Position: {contact.position}</p>
      <img src={contact.avatar_url as string} alt="" />
    </div>
  );
}
