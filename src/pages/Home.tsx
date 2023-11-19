import { Navigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { Navbar } from "../components/navigation/Navbar";
import { Sidebar } from "../components/sidebar/Sidebar";
import { Calendar } from "../components/calendar/Calendar";

export const Home = ({ session }: { session: Session | null }) => {
  if (!session) return <Navigate to={"/signin"} />;

  return (
    <main className={"flex h-fit min-h-screen w-screen flex-col bg-primary"}>
      <Navbar user={session.user} />
      <div className={"flex grow"}>
        <Sidebar />
        <Calendar />
      </div>
    </main>
  );
};
