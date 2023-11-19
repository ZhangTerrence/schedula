import { useState } from "react";
import { TasksList } from "./TasksList";
import { SideCalendar } from "./SideCalendar";

export const Sidebar = () => {
  const [tasksMode, setTasksMode] = useState(false);

  return (
    <div
      className={
        "flex w-[25rem] flex-col items-center border-r border-solid border-negative"
      }
    >
      <div className={"flex w-full justify-between p-4"}>
        <button
          className={`${
            tasksMode
              ? "bg-secondary text-negative"
              : "bg-negative text-primary"
          } grow rounded-bl-md rounded-tl-md py-2 text-xl font-semibold`}
          onClick={() => setTasksMode(false)}
        >
          Events
        </button>
        <button
          className={`${
            tasksMode
              ? "bg-negative text-primary"
              : "bg-secondary text-negative"
          } grow rounded-br-md rounded-tr-md py-2 text-xl font-semibold`}
          onClick={() => setTasksMode(true)}
        >
          Tasks
        </button>
      </div>
      {tasksMode ? <TasksList /> : <SideCalendar />}
    </div>
  );
};
