import { Contact, FullContact } from "../../../types/user-data";

interface ContactDetailsEditProps {
  contact: Partial<FullContact> | undefined;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ContactDetailsEdit({
  contact,
  handleChange,
}: ContactDetailsEditProps) {
  return (
    <>
      <div className="form-row">
        <label htmlFor="first_name">First Name:</label>
        <input
          name="first_name"
          value={contact?.first_name ?? ""}
          onChange={handleChange}
          placeholder="first_name"
        />
        <label htmlFor="last_name">Last Name:</label>
        <input
          name="last_name"
          value={contact?.last_name ?? ""}
          onChange={handleChange}
          placeholder="last_name"
        />
      </div>
      <div className="form-row">
        <label htmlFor="organization">Organization:</label>
        <input
          name="organization"
          value={contact?.organization ?? ""}
          onChange={handleChange}
          placeholder="Organization"
        />
      </div>
      <div className="form-row">
        <label htmlFor="position">Position:</label>
        <input
          name="position"
          value={contact?.position ?? ""}
          onChange={handleChange}
          placeholder="Position"
        />
      </div>
    </>
  );
}
