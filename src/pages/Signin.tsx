import { FormEvent, MouseEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSession } from "../hooks/useSession";
import { Loading } from "../components/Loading";
import {
  IoLogoGoogle,
  IoLogoGithub,
  IoCalendarClearSharp,
} from "react-icons/io5";
import supabase from "../config/supabase";
import type { Provider } from "@supabase/supabase-js";

export const Signin = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { session } = useSession();

  const handleCredentialSignin = async (e: FormEvent | MouseEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { session, user },
      error,
    } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else if (session && user) {
      navigate("/");
    }
  };

  const handleOAuthSignin = async (e: MouseEvent, provider: Provider) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
    });

    if (error) {
      alert(error.message);
    }
  };

  if (session) return <Navigate to={"/"} />;

  return (
    <main
      className={
        "relative flex h-fit min-h-screen w-screen flex-col items-center justify-center gap-y-12 bg-primary p-16"
      }
    >
      <Loading loading={loading} />
      <div className={"flex items-center gap-x-4 text-6xl text-negative"}>
        <IoCalendarClearSharp />
        Schedula
      </div>
      <div className={"flex w-[30rem] flex-col items-center gap-y-6"}>
        <div className={"w-full space-y-6"}>
          <button
            className="flex w-full items-center justify-center gap-x-4 rounded-xl bg-negative p-2 text-xl font-semibold text-primary hover:bg-gray-200"
            onClick={(e) => handleOAuthSignin(e, "google")}
          >
            <IoLogoGoogle />
            Continue with Google
          </button>
          <button
            className="flex w-full items-center justify-center gap-x-4 rounded-xl bg-negative p-2 text-xl font-semibold text-primary hover:bg-gray-200"
            onClick={(e) => handleOAuthSignin(e, "github")}
          >
            <IoLogoGithub />
            Continue with Github
          </button>
        </div>
        <hr className={"h-0.5 w-full bg-negative"} />
        <form className={"w-full space-y-4"}>
          <div className={"flex w-full flex-col"}>
            <label className="mb-2 text-xl text-negative" htmlFor="email">
              Email
            </label>
            <input
              className="rounded-md border border-solid border-negative bg-transparent p-2 text-xl text-negative outline-none transition-colors duration-300 focus:border-tertiary"
              name="email"
              type="email"
              placeholder={"Email"}
              autoFocus={true}
              value={credentials.email}
              onChange={(e) =>
                setCredentials((credentials) => {
                  return {
                    ...credentials,
                    email: e.target.value,
                  };
                })
              }
            />
          </div>
          <div className={"mb-4 flex w-full flex-col"}>
            <label className="mb-2 text-xl text-negative" htmlFor="password">
              Password
            </label>
            <input
              className="rounded-md border border-solid border-negative bg-transparent p-2 text-xl text-negative outline-none transition-colors duration-300 focus:border-tertiary"
              name="password"
              type="password"
              placeholder={"Password"}
              value={credentials.password}
              onChange={(e) =>
                setCredentials((credentials) => {
                  return {
                    ...credentials,
                    password: e.target.value,
                  };
                })
              }
            />
          </div>
          <button
            className="w-full rounded-xl bg-negative p-2 text-xl font-semibold text-primary transition-colors hover:bg-green-400"
            onClick={(e) => handleCredentialSignin(e)}
          >
            Sign In
          </button>
        </form>
        <p className="flex gap-x-2 text-xl text-negative">
          Don't have an account?
          <a
            className="cursor-pointer underline hover:text-tertiary"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </a>
        </p>
      </div>
    </main>
  );
};
