import { FullContact } from "backend/types/user-data";

interface SocialEditProps {
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

// social_accounts: {
//   id?: string;
//   platform: string;
//   username: string;
//   url?: string;
// }[];

export default function SocialEdit({
  contact,
  handleArrayChange,
  handleDeleteArrayItem,
  handleAddArrayItem,
}: SocialEditProps) {
  const renderSocialRow = (
    platform: string,
    username: string,
    url: string,
    index: number
  ) => {
    return (
      <>
        <label htmlFor="social">Platform:</label>
        <input
          name="platform"
          value={platform}
          onChange={(e) => handleArrayChange("social_accounts", index, e)}
          placeholder="Platform"
        />
        <label htmlFor="social">Username:</label>
        <input
          name="username"
          value={username}
          onChange={(e) => handleArrayChange("social_accounts", index, e)}
          placeholder="Username"
        />
        <label htmlFor="social">Url:</label>
        <input
          name="url"
          value={url}
          onChange={(e) => handleArrayChange("social_accounts", index, e)}
          placeholder="Url"
        />
        <button
          type="button"
          onClick={() => handleDeleteArrayItem("social_accounts", index)}
        >
          Delete
        </button>
      </>
    );
  };

  return (
    <>
      <div className="form-row-label">
        <strong>Social Accounts</strong>
      </div>

      <div className="multi-form-row" key="social_accounts">
        {contact ? (
          contact.social_accounts?.map((account, index) => (
            <div className="multi-row" key={index}>
              {renderSocialRow(
                account.platform,
                account.username,
                account.url,
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
            handleAddArrayItem("social_accounts");
          }}
        >
          Add Social Account
        </button>
      </div>
    </>
  );
}
