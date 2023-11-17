import supabase from "../config/supabaseClient";
import { useEffect } from "react";

export const Login = () => {
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        return;
      }

      console.log("logged in");
    };

    fetchUser();
  }, []);

  const signInGoogle = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
    <main
      className={"flex h-screen w-screen flex-col items-center justify-center"}
    >
      <button
        className={"border border-solid border-black p-4"}
        onClick={() => signInGoogle()}
      >
        Google
      </button>
      <button
        className={"border border-solid border-black p-4"}
        onClick={() => {
          console.log("a");
          supabase.auth.signOut();
        }}
      >
        Log Out
      </button>
    </main>
  );
};
