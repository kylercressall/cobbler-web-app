import NextAuth from "next-auth";

// declaring types for the info users will be using
interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface Contact {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  organization?: string | null;
  position?: string | null;
  avatar_url?: string | null;
}

interface FullContact {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string | null;
  created_at?: string | null;
  organization?: string | null;
  position?: string | null;

  phones: {
    id?: string;
    value: string;
    label?: string;
    is_primary: boolean;
  }[];

  emails: {
    id?: string;
    value: string;
    label?: string;
    is_primary: boolean;
  }[];

  social_accounts: {
    id?: string;
    platform: string;
    username: string;
    url: string;
  }[];

  photos: {
    id?: string;
    url: string;
    description?: string;
  }[];

  attributes: {
    id?: string;
    key: string;
    value: string;
    label: string;
  }[];
}

type PhoneInput = {
  id?: string;
  value: string;
  label?: string;
  is_primary: boolean;
};

type EmailInput = {
  id?: string;
  value: string;
  label?: string;
  is_primary: boolean;
};
