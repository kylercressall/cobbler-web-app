import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "backend/api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log("Session:", session);

  if (!session) {
    redirect("/login");
  } else {
    redirect("/dashboard");
  }
}
