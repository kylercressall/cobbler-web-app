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
