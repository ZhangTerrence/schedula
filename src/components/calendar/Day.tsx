import { useRedux } from "../../hooks/useRedux";
import dayjs from "dayjs";
import { updateCalendar } from "../../store/calendarSlice";
import { changeMode } from "../../store/modeSlice";
import generateMonth from "../../utilities/generateMonth";
import { Popup } from "../popup/Popup";
import { useState, useRef } from "react";
import { Object } from "../../store/tasksSlice";

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
  const [popup, setPopup] = useState(false);
  const { useAppSelector, useAppDispatch } = useRedux();
  const calendarState = useAppSelector((state) => state.calendar);
  const containerRef = useRef<HTMLDivElement>(null);
  const eventsState = useAppSelector((state) => state.events.events);
  const tasksState = useAppSelector((state) => state.tasks.tasks);
  const dispatch = useAppDispatch();

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

  const closePopup = () => {
    setPopup(false);
  };

  return (
    <>
      <div
        className={
          "flex flex-col items-center gap-y-2 border border-solid border-secondary p-2"
        }
        onClick={() => setPopup(true)}
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
            className={"flex w-full grow flex-col gap-y-1"}
            ref={containerRef}
          >
            {display.map((object, i) => {
              return (
                <div
                  key={i}
                  className={
                    "overflow-hidden text-ellipsis rounded-full border border-solid border-negative px-4 py-1 text-sm text-negative"
                  }
                >
                  {object.title}
                </div>
              );
            })}
            {amountEvents + amountTasks > 2 ? (
              <button
                className={
                  "w-full overflow-hidden text-ellipsis rounded-full border border-solid border-negative px-4 py-1 text-sm text-negative"
                }
                onClick={() => console.log("a")}
              >
                {amountEvents + amountTasks - 2} more
              </button>
            ) : null}
          </div>
        ) : (
          <div
            className={
              "flex w-full grow flex-col gap-y-px overflow-scroll px-3"
            }
          >
            {tasks.map((task, i) => {
              return (
                <div
                  className={"border-b border-solid border-negative py-4"}
                  key={i}
                >
                  <div
                    className={
                      "overflow-hidden text-ellipsis break-words text-negative"
                    }
                  >
                    {task.title}
                  </div>
                  <div className={"line-clamp-4 break-words text-negative"}>
                    {task.description}
                  </div>
                </div>
              );
            })}
            {events.map((event, j) => {
              return (
                <div
                  className={"border-b border-solid border-negative py-4"}
                  key={j}
                >
                  <div
                    className={
                      "overflow-hidden text-ellipsis break-words text-negative"
                    }
                  >
                    {event.title}
                  </div>
                  <div className={"line-clamp-4 break-words text-negative"}>
                    {event.description}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {popup ? <Popup closePopup={closePopup} day={day} /> : null}
    </>
  );
};
