import { getServerSession } from "next-auth";
import authOptions from "@/apps/frontend/pages/api/auth/[...nextauth]"; // one default from that file
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  redirect("/dashboard");
}
