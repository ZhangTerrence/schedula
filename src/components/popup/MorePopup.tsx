import { useRef } from "react";
import { useRedux } from "../../hooks/useRedux";
import type { Task } from "../../store/tasksSlice";
import type { Event } from "../../store/eventsSlice";
import dayjs from "dayjs";

export const MorePopup = ({
  day,
  selectInfo,
  closePopup,
}: {
  day: dayjs.Dayjs;
  selectInfo: (info: Task | Event) => void;
  closePopup: () => void;
}) => {
  const { useAppSelector } = useRedux();
  const tasksState = useAppSelector((state) => state.tasks.tasks);
  const eventsState = useAppSelector((state) => state.events.events);

  const backdropRef = useRef<HTMLDivElement>(null);

  const currentTasks = tasksState.filter(
    (tasks) => tasks.date === day.format("YYYY-MM-DD"),
  );
  const currentEvents = eventsState.filter(
    (events) => events.date === day.format("YYYY-MM-DD"),
  );

  return (
    <div
      className={"fixed left-0 top-0 z-50 h-screen w-screen backdrop-blur-sm"}
      onClick={(e) => {
        if (e.target === backdropRef.current) {
          closePopup();
        }
      }}
      ref={backdropRef}
    >
      <form
        className={
          "absolute inset-0 m-auto flex h-fit max-h-[30rem] w-[25rem] flex-col gap-y-4 overflow-y-scroll rounded-md border border-solid border-negative bg-primary p-4"
        }
      >
        <h1 className={"text-3xl text-negative underline"}>
          {dayjs(day).format("MMMM DD, YYYY")}
        </h1>
        {currentEvents.map((event, j) => {
          return (
            <button
              className={`rounded-md bg-teal-800 p-2 text-start`}
              key={j}
              onClick={(e) => {
                e.preventDefault();
                closePopup();
                selectInfo(event);
              }}
            >
              <div
                className={
                  "overflow-hidden text-ellipsis break-words text-negative"
                }
              >
                {event.title}
              </div>
            </button>
          );
        })}
        {currentTasks.map((task, i) => {
          return (
            <button
              className={`${
                task.completed ? "bg-blue-950" : "bg-blue-700"
              } rounded-md p-2 text-start`}
              key={i}
              onClick={(e) => {
                e.preventDefault();
                closePopup();
                selectInfo(task);
              }}
            >
              <div
                className={
                  "overflow-hidden text-ellipsis break-words text-negative"
                }
              >
                {task.title}
              </div>
            </button>
          );
        })}
      </form>
    </div>
  );
};
