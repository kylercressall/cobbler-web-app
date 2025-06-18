// Contact form is the form used to create/edit contacts
import { useState, useEffect } from "react";
import { Contact, FullContact } from "backend/types/user-data";
import ContactHeader from "./ContactHeader";

interface ContactCreateProps {
  onSubmit: (contactData: Partial<Contact>) => void;
  onDiscard: () => void;
}

type EditableContactStringField =
  | "first_name"
  | "last_name"
  | "organization"
  | "position"
  | "avatar_url";

const ContactInput = ({
  label,
  field,
  value,
  updateContact,
}: {
  label: string;
  field: EditableContactStringField;
  value: string;
  updateContact: (field: string, value: string) => void;
}) => (
  <div className="form-row">
    <label>{label}:</label>
    <input
      name={field}
      type="text"
      value={value}
      placeholder={label}
      onChange={(e) => updateContact(field, e.target.value)}
    />
  </div>
);

export default function ContactCreate({
  onSubmit,
  onDiscard,
}: ContactCreateProps) {
  const [contact, setContact] = useState<Partial<FullContact>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(contact);
  };

  const updateContact = (key: keyof FullContact, value: string) => {
    setContact({ ...contact, [key]: value });
  };

  return (
    <div>
      <ContactHeader>
        <button type="submit" form="create-contact-form">
          Create Contact
        </button>
        <button onClick={onDiscard}>Discard Contact</button>
      </ContactHeader>

      <form
        id="create-contact-form"
        className="contact-form main-content"
        onSubmit={handleSubmit}
      >
        <h2>Create Contact</h2>
        <ContactInput
          label="First Name"
          field="first_name"
          value={contact.first_name ?? ""}
          updateContact={(key: string, value: string) =>
            updateContact(key as EditableContactStringField, value)
          }
        />
        <ContactInput
          label="Last Name"
          field="last_name"
          value={contact.last_name ?? ""}
          updateContact={(key: string, value: string) =>
            updateContact(key as EditableContactStringField, value)
          }
        />
        <ContactInput
          label="Organization"
          field="organization"
          value={contact.organization ?? ""}
          updateContact={(key: string, value: string) =>
            updateContact(key as EditableContactStringField, value)
          }
        />
        <ContactInput
          label="Position"
          field="position"
          value={contact.position ?? ""}
          updateContact={(key: string, value: string) =>
            updateContact(key as EditableContactStringField, value)
          }
        />

        <i>Create then edit the contact to add additional details.</i>
      </form>
    </div>
  );
}
