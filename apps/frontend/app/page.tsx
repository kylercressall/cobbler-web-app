import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = true;
  if (!session) {
    redirect("/login");
  }

  redirect("/dashboard");
}
