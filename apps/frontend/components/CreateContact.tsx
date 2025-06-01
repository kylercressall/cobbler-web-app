import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function CreateContact({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    position: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      console.log(contact);

      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) return console.error("Not logged in");

      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contacts/createContact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // if needed
          },

          body: JSON.stringify(contact),
        }
      );

      onSuccess();
    } catch (err) {
      console.error("Create failed", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={contact.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        name="email"
        value={contact.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="phone"
        value={contact.phone}
        onChange={handleChange}
        placeholder="Phone"
      />
      <input
        name="organization"
        value={contact.organization}
        onChange={handleChange}
        placeholder="Organization"
      />
      <input
        name="position"
        value={contact.position}
        onChange={handleChange}
        placeholder="Position"
      />
      <button type="submit">Create Contact</button>
    </form>
  );
}
