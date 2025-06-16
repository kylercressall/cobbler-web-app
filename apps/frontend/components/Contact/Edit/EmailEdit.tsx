import { FullContact } from "backend/types/user-data";

interface EmailEditProps {
  contact: Partial<FullContact> | undefined;
  handleArrayChange: (
    arrayKey: "phones" | "emails" | "social_accounts" | "photos" | "attributes",
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleDeleteArrayItem: (
    field: "phones" | "emails" | "social_accounts" | "photos" | "attributes",
    index: number
  ) => void;
  handleAddArrayItem: (
    field: "phones" | "emails" | "social_accounts" | "photos" | "attributes"
  ) => void;
}

export default function EmailEdit({
  contact,
  handleArrayChange,
  handleDeleteArrayItem,
  handleAddArrayItem,
}: EmailEditProps) {
  const renderEmailRow = (
    number: string,
    label: string,
    is_primary: boolean,
    index: number
  ) => {
    return (
      <>
        <label htmlFor="email">Email:</label>
        <input
          name="value"
          value={number}
          onChange={(e) => handleArrayChange("emails", index, e)}
          placeholder="Number"
        />
        <label htmlFor="email">Label:</label>
        <input
          name="label"
          value={label}
          onChange={(e) => handleArrayChange("emails", index, e)}
          placeholder="Label"
        />
        <label htmlFor="email">Is Primary:</label>
        <input
          name="is_primary"
          type="checkbox"
          onChange={(e) => handleArrayChange("emails", index, e)}
          placeholder="Primary"
          checked={is_primary}
        />
        <button
          type="button"
          onClick={() => handleDeleteArrayItem("emails", index)}
        >
          Delete
        </button>
      </>
    );
  };

  return (
    <>
      <div className="form-row-label">
        <strong>Emails</strong>
      </div>

      <div className="multi-form-row" key="email-inputs">
        {contact ? (
          contact.emails?.map((email, index) => (
            <div className="multi-row" key={index}>
              {renderEmailRow(
                email.value,
                email.label ?? "",
                email.is_primary,
                index
              )}
            </div>
          ))
        ) : (
          <p>Contact is loading...</p>
        )}
        <button
          type="button"
          onClick={() => {
            handleAddArrayItem("emails");
          }}
        >
          Add Email
        </button>
      </div>
    </>
  );
}
