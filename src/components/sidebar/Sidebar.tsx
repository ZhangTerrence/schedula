import { useState } from "react";
import { TasksList } from "./TasksList";
import { SideCalendar } from "./SideCalendar";
import { IoCalendarClear, IoCheckmarkDoneCircle } from "react-icons/io5";

export const Sidebar = () => {
  const [mode, setMode] = useState<"events" | "tasks">("events");

  return (
    <div
      className={
        "flex w-[25rem] flex-col items-center overflow-y-scroll border-r border-solid border-negative"
      }
    >
      <div className={"w-full p-4"}>
        <div className={"flex justify-between rounded-md bg-secondary p-1"}>
          <button
            className={`${
              mode === "events"
                ? "bg-negative text-primary"
                : "bg-secondary text-negative"
            } flex grow items-center justify-center gap-x-2 rounded-md py-2 text-xl font-semibold`}
            onClick={() => setMode("events")}
          >
            <IoCalendarClear />
            Events
          </button>
          <button
            className={`${
              mode === "tasks"
                ? "bg-negative text-primary"
                : "bg-secondary text-negative"
            } flex grow items-center justify-center gap-x-2 rounded-md py-2 text-xl font-semibold`}
            onClick={() => setMode("tasks")}
          >
            <IoCheckmarkDoneCircle />
            Tasks
          </button>
        </div>
      </div>
      {mode === "events" ? <SideCalendar /> : <TasksList />}
    </div>
  );
};
