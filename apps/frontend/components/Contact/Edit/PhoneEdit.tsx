import { FullContact } from "backend/types/user-data";

interface PhoneEditProps {
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

export default function PhoneEdit({
  contact,
  handleArrayChange,
  handleDeleteArrayItem,
  handleAddArrayItem,
}: PhoneEditProps) {
  const renderPhoneRow = (
    number: string,
    label: string,
    is_primary: boolean,
    index: number
  ) => {
    return (
      <>
        <label htmlFor="phone_number">Number:</label>
        <input
          name="value"
          value={number}
          onChange={(e) => handleArrayChange("phones", index, e)}
          placeholder="Number"
        />
        <label htmlFor="phone_label">Label:</label>
        <input
          name="label"
          value={label}
          onChange={(e) => handleArrayChange("phones", index, e)}
          placeholder="Label"
        />
        <label htmlFor="phone_primary">Is Primary:</label>
        <input
          name="is_primary"
          type="checkbox"
          onChange={(e) => handleArrayChange("phones", index, e)}
          placeholder="Primary"
          checked={is_primary}
        />
        <button
          type="button"
          onClick={() => handleDeleteArrayItem("phones", index)}
        >
          Delete
        </button>
      </>
    );
  };

  return (
    <>
      <div className="form-row-label">
        <strong>Phone Numbers</strong>
      </div>
      <div className="multi-form-row" key="phone-inputs">
        {contact ? (
          contact.phones?.map((phone, index) => (
            <div className="multi-row" key={index}>
              {renderPhoneRow(
                phone.value,
                phone.label ?? "",
                phone.is_primary,
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
            handleAddArrayItem("phones");
          }}
        >
          Add Phone
        </button>
      </div>
    </>
  );
}
