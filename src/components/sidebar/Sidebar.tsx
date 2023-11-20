import { useState } from "react";
import { TasksList } from "./TasksList";
import { SideCalendar } from "./SideCalendar";

export const Sidebar = () => {
  const [mode, setMode] = useState<"events" | "tasks">("events");

  return (
    <div
      className={
        "flex w-[25rem] flex-col items-center overflow-y-scroll border-r border-solid border-negative"
      }
    >
      <div className={"flex w-full justify-between p-4"}>
        <button
          className={`${
            mode === "events"
              ? "bg-negative text-primary"
              : "bg-secondary text-negative"
          } grow rounded-bl-md rounded-tl-md py-2 text-xl font-semibold`}
          onClick={() => setMode("events")}
        >
          Events
        </button>
        <button
          className={`${
            mode === "tasks"
              ? "bg-negative text-primary"
              : "bg-secondary text-negative"
          } grow rounded-br-md rounded-tr-md py-2 text-xl font-semibold`}
          onClick={() => setMode("tasks")}
        >
          Tasks
        </button>
      </div>
      {mode === "events" ? <SideCalendar /> : <TasksList />}
    </div>
  );
};
