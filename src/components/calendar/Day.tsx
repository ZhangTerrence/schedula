import { useState } from "react";
import { useRedux } from "../../hooks/useRedux";
import { changeMode } from "../../store/modeSlice";
import { updateCalendar } from "../../store/calendarSlice";
import type { Task } from "../../store/tasksSlice";
import type { Event } from "../../store/eventsSlice";
import { CreatePopup } from "../popup/CreatePopup";
import { MorePopup } from "../popup/MorePopup";
import { InfoPopup } from "../popup/InfoPopup";
import dayjs from "dayjs";
import generateMonth from "../../utilities/generateMonth";

type PopupTypes = "create" | "more" | "info" | null;

export const Day = ({
  day,
  localWeek,
  localDay,
  mode,
}: {
  day: dayjs.Dayjs;
  localWeek: number;
  localDay: number;
  mode: "month" | "week" | "day";
}) => {
  const { useAppSelector, useAppDispatch } = useRedux();
  const calendarState = useAppSelector((state) => state.calendar);
  const tasksState = useAppSelector((state) => state.tasks.tasks);
  const eventsState = useAppSelector((state) => state.events.events);
  const dispatch = useAppDispatch();

  const [popup, setPopup] = useState<PopupTypes>(null);
  const [selectedInfo, setSelectedInfo] = useState<Task | Event | null>(null);

  const tasks = tasksState.filter((event) => {
    return (
      dayjs(event.date).format("DD MMMM YYYY") === day.format("DD MMMM YYYY")
    );
  });
  const amountTasks = tasks.length;

  const events = eventsState.filter((event) => {
    return (
      dayjs(event.date).format("DD MMMM YYYY") === day.format("DD MMMM YYYY")
    );
  });
  const amountEvents = events.length;

  let displayedTasks: Task[] = [];
  let displayedEvents: Event[] = [];
  if (amountEvents >= 2) {
    displayedEvents = events.slice(0, 2);
  } else if (amountEvents < 2) {
    displayedEvents = events.slice(0, amountEvents);
    displayedTasks = tasks.slice(0, 2 - amountEvents);
  }

  const closePopup = () => {
    setPopup(null);
  };

  const selectInfo = (info: Task | Event) => {
    setSelectedInfo(info);
    setPopup("info");
  };

  const renderPopup = () => {
    if (!popup) {
      return null;
    }

    if (popup === "create") {
      return <CreatePopup day={day} closePopup={closePopup} />;
    } else if (popup === "more") {
      return (
        <MorePopup day={day} selectInfo={selectInfo} closePopup={closePopup} />
      );
    } else if (popup === "info") {
      return <InfoPopup info={selectedInfo} closePopup={closePopup} />;
    }
  };

  const isSelectedDay = (day: dayjs.Dayjs) => {
    return (
      day.format("DD-MM-YY") ===
      calendarState.array[calendarState.current.week][
        calendarState.current.day
      ].format("DD-MM-YY")
    );
  };

  const isCurrentMonth = (day: dayjs.Dayjs) => {
    return (
      parseInt(day.format("MM")) === (calendarState.current.month % 12) + 1
    );
  };

  const isToday = (day: dayjs.Dayjs) => {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY");
  };

  const changeDate = () => {
    if (localWeek <= 1 && parseInt(day.format("D")) >= 14) {
      let month = calendarState.current.month - 1;
      const array = generateMonth(month);

      for (let i = 4; i <= 5; i++) {
        for (let j = 0; j <= 6; j++) {
          if (array[i][j].format("D") === day.format("D")) {
            dispatch(
              updateCalendar({
                array,
                current: {
                  month,
                  week: i,
                  day: j,
                },
              }),
            );

            return;
          }
        }
      }
    } else if (localWeek >= 4 && parseInt(day.format("D")) <= 14) {
      let month = calendarState.current.month + 1;
      const array = generateMonth(month);

      for (let i = 0; i <= 1; i++) {
        for (let j = 0; j <= 6; j++) {
          if (array[i][j].format("D") === day.format("D")) {
            dispatch(
              updateCalendar({
                array,
                current: {
                  month,
                  week: i,
                  day: j,
                },
              }),
            );

            return;
          }
        }
      }
    }

    const month = calendarState.current.month;

    dispatch(
      updateCalendar({
        ...calendarState,
        current: {
          month,
          week: localWeek,
          day: localDay,
        },
      }),
    );
  };

  return (
    <>
      {renderPopup()}
      <div
        className={
          "flex min-h-full flex-col items-center gap-y-2 border border-solid border-secondary p-2"
        }
        onClick={(e) => {
          if (e.currentTarget === e.target) {
            setPopup("create");
          }
        }}
      >
        {mode !== "day" ? (
          <button
            className={`
          ${isCurrentMonth(day) ? "text-negative" : "text-tertiary"} 
          ${isSelectedDay(day) ? "bg-accent" : ""} 
          ${isToday(day) ? "bg-accent-secondary" : ""} 
          w-12 rounded-full text-center hover:bg-negative hover:text-primary`}
            onClick={() => {
              changeDate();
              dispatch(
                changeMode({
                  mode: "day",
                }),
              );
            }}
          >
            {day.format("DD")}
          </button>
        ) : null}
        {mode === "month" ? (
          <div
            className={"flex w-full grow flex-col gap-y-1.5"}
            onClick={(e) => {
              if (e.currentTarget === e.target) {
                setPopup("create");
              }
            }}
          >
            {displayedEvents.map((event, i) => {
              return (
                <button
                  key={i}
                  className={
                    "overflow-hidden text-ellipsis whitespace-nowrap rounded-full bg-teal-800 px-4 py-1 text-start text-sm text-negative"
                  }
                  onClick={() => {
                    setSelectedInfo(event);

                    setPopup("info");
                  }}
                >
                  {event.title}
                </button>
              );
            })}
            {displayedTasks.map((task, i) => {
              return (
                <button
                  key={i}
                  className={`${
                    task.completed ? "bg-blue-950" : "bg-blue-700"
                  } overflow-hidden text-ellipsis whitespace-nowrap rounded-full px-4 py-1 text-start text-sm text-negative`}
                  onClick={() => {
                    setSelectedInfo(task);

                    setPopup("info");
                  }}
                >
                  {task.title}
                </button>
              );
            })}

            {amountEvents + amountTasks > 2 ? (
              <button
                className={
                  "w-full overflow-hidden text-ellipsis rounded-full px-4 py-1 text-sm text-negative hover:bg-secondary"
                }
                onClick={() => setPopup("more")}
              >
                {amountEvents + amountTasks - 2} more
              </button>
            ) : null}
          </div>
        ) : (
          <div
            className={
              "flex w-full grow flex-col gap-y-4 overflow-y-scroll px-1"
            }
            onClick={(e) => {
              if (e.currentTarget === e.target) {
                setPopup("create");
              }
            }}
          >
            {events.map((event, j) => {
              return (
                <button
                  className={"rounded-md bg-teal-800 p-2 py-4 text-start"}
                  key={j}
                  onClick={() => {
                    setSelectedInfo(event);
                    setPopup("info");
                  }}
                >
                  <div
                    className={
                      "overflow-hidden text-ellipsis text-negative underline"
                    }
                  >
                    {event.title}
                  </div>
                  <div className={"line-clamp-4 break-words text-negative"}>
                    {event.description}
                  </div>
                </button>
              );
            })}
            {tasks.map((task, i) => {
              return (
                <button
                  className={`${
                    task.completed ? "bg-blue-950" : "bg-blue-700"
                  } rounded-md p-2 text-start`}
                  key={i}
                  onClick={() => {
                    setSelectedInfo(task);
                    setPopup("info");
                  }}
                >
                  <div
                    className={
                      "overflow-hidden text-ellipsis text-negative underline"
                    }
                  >
                    {task.title}
                  </div>
                  <div className={"line-clamp-4 break-words text-negative"}>
                    {task.description}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};
