import { useEffect, useState } from "react";

import {
  Contact,
  FullContact,
} from "../../../../packages/shared-types/user-data";
import ContactHeader from "./ContactHeader";
import PhoneEdit from "./Edit/PhoneEdit";
import EmailEdit from "./Edit/EmailEdit";
import ContactDetailsEdit from "./Edit/ContactDetailsEdit";
import SocialEdit from "./Edit/SocialEdit";
import CustomAttributeEdit from "./Edit/CustomAttributeEdit";

interface ContactEditProps {
  contactData: Partial<FullContact>;
  onSuccess: (contactData: Partial<FullContact> | undefined) => void;
  onDiscard: () => void;
  onDelete: () => void;
}

export default function ContactEdit({
  contactData,
  onSuccess,
  onDiscard,
  onDelete,
}: ContactEditProps) {
  const [contact, setContact] = useState<Partial<FullContact> | undefined>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (
    arrayKey: "phones" | "emails" | "social_accounts" | "photos" | "attributes",
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!contact) return;

    const array = contact[arrayKey];
    if (!Array.isArray(array)) return;

    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    const updatedArray = array.map((item, i) => {
      if (i === index) {
        return { ...item, [name]: newValue };
      }
      return item;
    });

    setContact({
      ...contact,
      [arrayKey]: updatedArray,
    });
  };

  const handleAddArrayItem = (
    field: "phones" | "emails" | "social_accounts" | "photos" | "attributes"
  ) => {
    if (!contact) return;

    if (field == "phones" || field == "emails") {
      const newItem = { value: "", label: "", is_primary: false };
      setContact({ ...contact, [field]: [...(contact[field] ?? []), newItem] });
      return;
    }
    if (field == "social_accounts") {
      const newItem = { platform: "", username: "", url: "" };
      setContact({ ...contact, [field]: [...(contact[field] ?? []), newItem] });
      return;
    }
    if (field == "attributes") {
      const newItem = { key: "", value: "", label: "" };
      setContact({
        ...contact,
        [field]: [...(contact[field] ?? []), newItem],
      });
      return;
    }

    console.log("AddArrayItem invalid field given");
  };

  const handleDeleteArrayItem = (
    field: "phones" | "emails" | "social_accounts" | "photos" | "attributes",
    index: number
  ) => {
    if (!contact) return;

    const updatedArray = [...(contact[field] ?? [])];
    updatedArray.splice(index, 1);

    setContact({
      ...contact,
      [field]: updatedArray,
    });
  };

  useEffect(() => {
    if (contactData) {
      setContact(contactData);
    }
  }, [contactData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(contact);
  };

  return (
    <div>
      <ContactHeader>
        <button type="submit" form="contact-form">
          Confirm Edit
        </button>
        <button type="submit" onClick={onDiscard}>
          Discard Changes
        </button>
        <button onClick={onDelete}>Delete Contact</button>
      </ContactHeader>
      <form
        id="contact-form"
        className="contact-form main-content"
        onSubmit={handleSubmit}
      >
        <ContactDetailsEdit contact={contact} handleChange={handleChange} />
        <PhoneEdit
          contact={contact}
          handleArrayChange={handleArrayChange}
          handleAddArrayItem={handleAddArrayItem}
          handleDeleteArrayItem={handleDeleteArrayItem}
        />
        <EmailEdit
          contact={contact}
          handleArrayChange={handleArrayChange}
          handleAddArrayItem={handleAddArrayItem}
          handleDeleteArrayItem={handleDeleteArrayItem}
        />
        <SocialEdit
          contact={contact}
          handleArrayChange={handleArrayChange}
          handleAddArrayItem={handleAddArrayItem}
          handleDeleteArrayItem={handleDeleteArrayItem}
        />
        <CustomAttributeEdit
          contact={contact}
          handleArrayChange={handleArrayChange}
          handleAddArrayItem={handleAddArrayItem}
          handleDeleteArrayItem={handleDeleteArrayItem}
        />
      </form>
    </div>
  );
}
