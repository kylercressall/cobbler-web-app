// When you didn't select, edit or create contact

import ContactHeader from "./ContactHeader";

export default function ContactDashboard({
  onCreate,
}: {
  onCreate: () => void;
}) {
  return (
    <div>
      <ContactHeader>
        <button onClick={onCreate}>Create New Contact</button>
      </ContactHeader>
      <div className="main-content">
        <h2>Dashboard Page</h2>
        <p>Canvas 2d map layout goes here</p>
      </div>
    </div>
  );
}
