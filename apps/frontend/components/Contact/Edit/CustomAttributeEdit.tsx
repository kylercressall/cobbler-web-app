import { FullContact } from "../../../../../packages/shared-types/user-data";

interface CustomAttributeEditProps {
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

export default function CustomAttributeEdit({
  contact,
  handleArrayChange,
  handleDeleteArrayItem,
  handleAddArrayItem,
}: CustomAttributeEditProps) {
  const renderAttributeRow = (
    key: string,
    value: string,
    label: string,
    index: number
  ) => {
    return (
      <>
        <label htmlFor="custom_attribute">Key:</label>
        <input
          name="key"
          value={key}
          onChange={(e) => handleArrayChange("attributes", index, e)}
          placeholder="Number"
        />
        <label htmlFor="custom_attribute">Value:</label>
        <input
          name="value"
          value={value}
          onChange={(e) => handleArrayChange("attributes", index, e)}
          placeholder="Label"
        />
        <label htmlFor="custom_attribute">Label:</label>
        <input
          name="label"
          value={label}
          onChange={(e) => handleArrayChange("attributes", index, e)}
          placeholder="Label"
        />
        <button
          type="button"
          onClick={() => handleDeleteArrayItem("attributes", index)}
        >
          Delete
        </button>
      </>
    );
  };

  return (
    <>
      <div className="form-row-label">
        <strong>Custom Attributes</strong>
      </div>
      <div className="multi-form-row" key="phone-inputs">
        {contact ? (
          contact.attributes?.map((attribute, index) => (
            <div className="multi-row" key={index}>
              {renderAttributeRow(
                attribute.key,
                attribute.value,
                attribute.label,
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
            handleAddArrayItem("attributes");
          }}
        >
          Add Custom Attribute
        </button>
      </div>
    </>
  );
}
