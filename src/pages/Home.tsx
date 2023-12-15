import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useRedux } from "../hooks/useRedux";
import { type Task, addTask } from "../store/tasksSlice";
import { type Event, addEvent } from "../store/eventsSlice";
import { Navbar } from "../components/navigation/Navbar";
import { Sidebar } from "../components/sidebar/Sidebar";
import { Calendar } from "../components/calendar/Calendar";
import supabase from "../config/supabase";
import type { Session } from "@supabase/supabase-js";

export const Home = ({ session }: { session: Session | null }) => {
  if (!session) return <Navigate to={"/signin"} />;

  const { useAppDispatch } = useRedux();
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from("events")
        .select()
        .eq("user_id", session?.user.id);

      if (error) {
        alert(error.message);
      } else {
        for (const event of data) {
          dispatch(addEvent(event as Event));
        }
      }
    }

    fetchEvents();

    async function fetchTasks() {
      const { data, error } = await supabase
        .from("tasks")
        .select()
        .eq("user_id", session?.user.id);

      if (error) {
        alert(error.message);
      } else {
        for (const task of data) {
          dispatch(addTask(task as Task));
        }
      }
    }

    fetchTasks();
  }, []);

  return (
    <main
      className={
        "flex h-screen max-h-screen min-h-screen w-screen flex-col bg-primary"
      }
    >
      <Navbar user={session.user} />
      <div className={"flex h-[92.5%] max-h-[92.5%]"}>
        <Sidebar />
        <Calendar />
      </div>
    </main>
  );
};
