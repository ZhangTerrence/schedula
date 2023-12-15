import { useState } from "react";
import { useRedux } from "../../hooks/useRedux";
import { changeMode } from "../../store/modeSlice";
import { updateCalendar } from "../../store/calendarSlice";
import type { Object } from "../../store/tasksSlice";
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
  const [selectedInfo, setSelectedInfo] = useState<Object | null>(null);
  const [selectedInfoType, setSelectedInfoType] = useState<
    "tasks" | "events" | null
  >(null);

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

  let display: Object[] = [];
  if (amountTasks === 2) {
    display = tasks.slice(0, 2);
  } else if (amountTasks < 2) {
    display = tasks
      .slice(0, amountTasks)
      .concat(events.slice(0, 2 - amountTasks));
  }

  const closePopup = () => {
    setPopup(null);
  };

  const selectInfo = (info: Object, type: "tasks" | "events") => {
    setSelectedInfo(info);
    setSelectedInfoType(type);
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
      return (
        <InfoPopup
          info={selectedInfo}
          type={selectedInfoType}
          closePopup={closePopup}
        />
      );
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
          "flex flex-col items-center gap-y-2 border border-solid border-secondary p-2"
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
            {display.map((object, i) => {
              return (
                <button
                  key={i}
                  className={
                    "overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-solid border-negative px-4 py-1 text-start text-sm text-negative"
                  }
                  onClick={() => {
                    setSelectedInfo(object);
                    if (i < amountTasks) {
                      setSelectedInfoType("tasks");
                    } else {
                      setSelectedInfoType("events");
                    }
                    setPopup("info");
                  }}
                >
                  {object.title}
                </button>
              );
            })}
            {amountEvents + amountTasks > 2 ? (
              <button
                className={
                  "w-full overflow-hidden text-ellipsis rounded-full border border-solid border-negative px-4 py-1 text-sm text-negative"
                }
                onClick={() => setPopup("more")}
              >
                {amountEvents + amountTasks - 2} more
              </button>
            ) : null}
          </div>
        ) : (
          <div
            className={"flex w-full grow flex-col overflow-scroll px-3"}
            onClick={(e) => {
              if (e.currentTarget === e.target) {
                setPopup("create");
              }
            }}
          >
            {tasks.map((task, i) => {
              return (
                <button
                  className={
                    "border-b border-solid border-negative py-4 text-start"
                  }
                  key={i}
                  onClick={() => {
                    setSelectedInfo(task);
                    setSelectedInfoType("tasks");
                    setPopup("info");
                  }}
                >
                  <div
                    className={"overflow-hidden text-ellipsis text-negative"}
                  >
                    {task.title}
                  </div>
                  <div className={"line-clamp-4 break-words text-negative"}>
                    {task.description}
                  </div>
                </button>
              );
            })}
            {events.map((event, j) => {
              return (
                <button
                  className={
                    "border-b border-solid border-negative py-4 text-start"
                  }
                  key={j}
                  onClick={() => {
                    setSelectedInfo(event);
                    setSelectedInfoType("events");
                    setPopup("info");
                  }}
                >
                  <div
                    className={"overflow-hidden text-ellipsis text-negative"}
                  >
                    {event.title}
                  </div>
                  <div className={"line-clamp-4 break-words text-negative"}>
                    {event.description}
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
