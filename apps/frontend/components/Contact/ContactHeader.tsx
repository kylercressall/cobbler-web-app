// Contact header is a header to hold buttons above the contact details/edit/create screen
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

export default function ContactHeader({ children }: Props) {
  return <div className="contact-header">{children}</div>;
}
