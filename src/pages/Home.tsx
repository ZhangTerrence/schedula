import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabase";
import type { Session } from "@supabase/supabase-js";

export const Home = ({ session }: { session: Session | null }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate("/signin");
    }
  }, [session]);

  return (
    <main>
      <button onClick={() => supabase.auth.signOut()}>Log out</button>
    </main>
  );
};
