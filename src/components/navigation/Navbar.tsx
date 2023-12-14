import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import supabase from "../../config/supabase";
import { IoCalendarClearSharp } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";

export const Navbar = ({ user }: { user: User }) => {
  const [dropdown, setDropdown] = useState(false);

  return (
    <nav
      className={
        "z-20 flex h-[7.5%] w-screen items-center justify-between border-b border-solid border-negative px-4"
      }
    >
      <div className={"flex items-center gap-x-2 text-2xl text-negative"}>
        <IoCalendarClearSharp />
        Schedula
      </div>
      <div className={"relative flex h-full items-center"}>
        <img
          className={
            "aspect-square w-10 rounded-full border-2 border-solid border-negative"
          }
          src={user.user_metadata.avatar_url}
          alt="user pfp"
          onClick={() => setDropdown(!dropdown)}
        />
        {dropdown ? (
          <>
            <div
              className={
                "absolute right-0 top-full z-20 mt-4 w-[30rem] rounded-md border border-solid border-negative bg-primary p-4"
              }
            >
              <FaPlus
                className={
                  "absolute right-0 top-0 m-4 rotate-45 rounded-full p-1 text-4xl text-negative hover:bg-secondary"
                }
                onClick={() => setDropdown(false)}
              />
              <div className={"mb-4 flex flex-col items-center gap-y-4"}>
                <p className={"text-negative"}>{user.email}</p>
                <img
                  className={
                    "aspect-square w-24 rounded-full border-2 border-solid border-negative"
                  }
                  src={user.user_metadata.avatar_url}
                  alt="user pfp"
                />
                <p className={"text-3xl text-negative"}>
                  {user.user_metadata.name}
                </p>
              </div>
              <button
                className={
                  "w-full rounded-md bg-secondary py-2 text-xl text-negative transition-colors duration-300 hover:bg-red-700"
                }
                onClick={() => supabase.auth.signOut()}
              >
                Log out
              </button>
            </div>
            <div
              className={"fixed right-0 top-0 h-screen w-screen"}
              onClick={() => setDropdown(false)}
            ></div>
          </>
        ) : null}
      </div>
    </nav>
  );
};
