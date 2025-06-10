// Contact Details is the right pane that displays the details of a given contact
import { Contact, FullContact } from "../../types/user-data";
import { useEffect, useState } from "react";

import ContactHeader from "./ContactHeader";
import { getFetchToken } from "backend/lib/getFetchToken";

interface ContactDetailsProps {
  contactId: string;
  onEdit: () => void;
  onCreate: () => void;
  toggleDashboard: () => void;
}

export default function ContactDetails({
  contactId,
  onEdit,
  onCreate,
  toggleDashboard,
}: ContactDetailsProps) {
  const [contact, setContact] = useState<FullContact | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAllContactDetails = async () => {
    try {
      const token = await getFetchToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contacts/${contactId}/full`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const data = await res.json();

      return data;
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    }
  };

  useEffect(() => {
    const fetchContact = async () => {
      if (!contactId) return;
      setLoading(true);
      const data = await fetchAllContactDetails();
      setContact(data);
      setLoading(false);
    };
    fetchContact();
  }, [contactId]);

  return (
    <div>
      <ContactHeader>
        <button onClick={onEdit}>Edit Contact</button>
        <button onClick={onCreate}>Create New Contact</button>
        <button onClick={toggleDashboard}>View Dashboard</button>
      </ContactHeader>
      <div className="main-content">
        {loading || !contact ? (
          <p>Loading...</p>
        ) : (
          <>
            <h2>
              {contact.first_name} {contact.last_name}
            </h2>
            <p>Organization: {contact.organization}</p>
            <p>Position: {contact.position}</p>
            {contact.avatar_url && (
              <img
                src={contact.avatar_url as string}
                alt={`${contact.first_name}'s avatar`}
              />
            )}
            <div className="emails">
              <h3>Emails</h3>
              {contact.emails.length === 0 ? (
                <p>No emails found.</p>
              ) : (
                <ul>
                  {contact.emails.map((email, index) => (
                    <li key={index}>
                      <strong>{email.label || "Email"}:</strong> {email.value}
                      {email.is_primary && <span> (Primary)</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="phone-numbers">
              <h3>Phone Numbers</h3>
              {contact.phones.length === 0 ? (
                <p>No phone numbers found.</p>
              ) : (
                <ul>
                  {contact.phones.map((phone, index) => (
                    <li key={index}>
                      <strong>{phone.label || "Phone"}:</strong> {phone.value}
                      {phone.is_primary && <span> (Primary)</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="social-accounts">
              <h3>Social Accounts</h3>
              {contact.social_accounts.length === 0 ? (
                <p>No social media accounts found.</p>
              ) : (
                <ul>
                  {contact.social_accounts.map((account, index) => (
                    <li key={index}>
                      <strong>{account.platform || "Account"}:</strong>{" "}
                      <a href={account.url}>{account.username}</a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="attributes">
              <h3>Custom Attributes</h3>
              {contact.social_accounts.length === 0 ? (
                <p>No custom attributes found.</p>
              ) : (
                <ul>
                  {contact.attributes.map((attribute, index) => (
                    <li key={index}>
                      <strong>{attribute.key || "Phone"}:</strong>{" "}
                      {attribute.value}
                      {attribute.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="photos">
              <h3>Photos</h3>
              {contact.social_accounts.length === 0 ? (
                <p>No photos found.</p>
              ) : (
                <ul>
                  {contact.photos.map((photo, index) => (
                    <li key={index}>
                      {photo.description} {photo.url}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
