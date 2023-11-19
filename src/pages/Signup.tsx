import { FormEvent, MouseEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Provider } from "@supabase/supabase-js";
import supabase from "../config/supabase";
import { Loading } from "../components/Loading";
import { IoLogoGithub, IoLogoGoogle } from "react-icons/io5";

export const Signup = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCredentialSignup = async (e: FormEvent | MouseEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user, session },
      error,
    } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          name: credentials.username,
          avatar_url:
            "https://utfs.io/f/3fbc2bf9-050e-4a0e-b15a-1c78ebaaeed0_DefaultUser.png",
        },
      },
    });

    if (error) {
      alert(error.message);
    } else if (user && session) {
      navigate("/");
    }

    setLoading(false);
  };

  const handleOAuthSignup = async (e: MouseEvent, provider: Provider) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: "/",
      },
    });

    if (error) {
      alert(error.message);
    }
  };

  return (
    <main
      className={
        "relative grid h-fit min-h-screen w-screen place-content-center bg-primary p-16"
      }
    >
      <Loading loading={loading} />
      <div className={"flex w-[30rem] flex-col items-center gap-y-6"}>
        <div className={"w-full space-y-6"}>
          <button
            className="flex w-full items-center justify-center gap-x-4 rounded-xl bg-negative p-2 text-xl font-semibold text-primary hover:bg-gray-200"
            onClick={(e) => handleOAuthSignup(e, "google")}
          >
            <IoLogoGoogle />
            Continue with Google
          </button>
          <button
            className="flex w-full items-center justify-center gap-x-4 rounded-xl bg-negative p-2 text-xl font-semibold text-primary hover:bg-gray-200"
            onClick={(e) => handleOAuthSignup(e, "github")}
          >
            <IoLogoGithub />
            Continue with Github
          </button>
        </div>
        <hr className={"h-0.5 w-full bg-negative"} />
        <form className={"w-full space-y-4"}>
          <div className={"flex w-full flex-col"}>
            <label className="mb-2 text-xl text-negative" htmlFor="username">
              Username
            </label>
            <input
              className="rounded-md border border-solid border-negative bg-transparent p-2 text-xl text-negative outline-none transition-colors duration-300 focus:border-secondary "
              name="username"
              type="text"
              placeholder={"Username"}
              autoFocus={true}
              value={credentials.username}
              onChange={(e) =>
                setCredentials((credentials) => {
                  return {
                    ...credentials,
                    username: e.target.value,
                  };
                })
              }
            />
          </div>
          <div className={"flex w-full flex-col"}>
            <label className="mb-2 text-xl text-negative" htmlFor="email">
              Email
            </label>
            <input
              className="rounded-md border border-solid border-negative bg-transparent p-2 text-xl text-negative outline-none transition-colors duration-300 focus:border-secondary "
              name="email"
              type="email"
              placeholder={"Email"}
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
              className="rounded-md border border-solid border-negative bg-transparent p-2 text-xl text-negative outline-none transition-colors duration-300 focus:border-secondary"
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
            onClick={(e) => handleCredentialSignup(e)}
          >
            Sign Up
          </button>
        </form>
        <p className="flex gap-x-2 text-xl text-negative">
          Already have an account?
          <a
            className="cursor-pointer underline hover:text-gray-200"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </a>
        </p>
      </div>
    </main>
  );
};
