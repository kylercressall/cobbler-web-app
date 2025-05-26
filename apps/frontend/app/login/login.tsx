"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div>
      <p>Log in to continue</p>
      <button onClick={() => signIn()}>Sign In</button>
    </div>
  );
}
