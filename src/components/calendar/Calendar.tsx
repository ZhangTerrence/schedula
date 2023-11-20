import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useRedux } from "../../hooks/useRedux";
import { updateCalendar } from "../../store/calendarSlice";
import generateMonth from "../../utilities/generateMonth";
import { MonthMode } from "./MonthMode";
import { WeekMode } from "./WeekMode";
import { DayMode } from "./DayMode";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export const Calendar = () => {
  const [mode, setMode] = useState<"month" | "week" | "day">("month");
  const [weekNumber, setWeekNumber] = useState(0);
  const [dayNumber, setDayNumber] = useState([0, 0]);
  const { useAppDispatch, useAppSelector } = useRedux();
  const calendarState = useAppSelector((state) => state.calendar);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const currentWeek = calendarState.month.filter((week) =>
      week
        .map((day) => day.format("DD-MM-YY"))
        .includes(dayjs().format("DD-MM-YY")),
    )[0];

    const indexOf = calendarState.month.indexOf(currentWeek);
    setWeekNumber(indexOf);

    calendarState.month[indexOf].forEach((day, i) => {
      if (day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")) {
        setDayNumber([indexOf, i]);
      }
    });
  }, []);

  const renderHeader = () => {
    if (mode === "month") {
      return dayjs(new Date(dayjs().year(), calendarState.index)).format(
        "MMMM YYYY",
      );
    } else if (mode === "week") {
      if (
        parseInt(calendarState.month[weekNumber][6].format("D")) <
        parseInt(calendarState.month[weekNumber][0].format("D"))
      ) {
        return `${calendarState.month[weekNumber][0].format(
          "MMM",
        )}-${calendarState.month[weekNumber][6].format("MMM YYYY")}`;
      } else {
        return calendarState.month[weekNumber][6].format("MMMM YYYY");
      }
    } else {
      return calendarState.month[dayNumber[0]][dayNumber[1]].format(
        "MMMM YYYY",
      );
    }
  };

  const renderMode = () => {
    if (mode === "month") {
      return <MonthMode month={calendarState.month} />;
    } else if (mode === "week") {
      return <WeekMode week={calendarState.month[weekNumber]} />;
    } else
      return <DayMode day={calendarState.month[dayNumber[0]][dayNumber[1]]} />;
  };

  const changeMonth = (op: number) => {
    dispatch(
      updateCalendar({
        index: calendarState.index + op,
        month: generateMonth(calendarState.index + op),
      }),
    );
  };

  const changeWeek = (op: number) => {
    let condition;

    if (op < 0) {
      condition = weekNumber > 0;
    } else {
      condition = weekNumber < 5;
    }

    if (condition) {
      setWeekNumber((weekNumber) => weekNumber + op);
    } else {
      changeMonth(op);

      const newMonth = generateMonth(calendarState.index + op);

      let i;
      let j;
      if (op < 0) {
        i = 5;
        j = 0;
      } else {
        i = 0;
        j = 6;
      }

      while (
        parseInt(newMonth[i][j].format("D")) !==
        parseInt(calendarState.month[weekNumber][j].format("D"))
      ) {
        i += op;
      }

      setWeekNumber(i);
    }
  };

  const changeDay = (op: number) => {
    let condition1;
    let condition2;

    if (op < 0) {
      condition1 = dayNumber[1] > 0;
      condition2 = dayNumber[0] > 0;
    } else {
      condition1 = dayNumber[1] < 6;
      condition2 = dayNumber[0] < 5;
    }

    if ((condition1 && condition2) || (condition1 && !condition2)) {
      setDayNumber((dayNumber) => [dayNumber[0], dayNumber[1] + op]);
    } else if (!condition1 && condition2) {
      changeWeek(op);
      if (op < 0) {
        setDayNumber((dayNumber) => [dayNumber[0] - 1, 6]);
      } else {
        setDayNumber((dayNumber) => [dayNumber[0] + 1, 0]);
      }
    } else if (!condition1 && !condition2) {
      changeMonth(op);

      const newMonth = generateMonth(calendarState.index + op);

      let i;
      let j;
      if (op < 0) {
        i = 5;
        j = 0;
      } else {
        i = 0;
        j = 6;
      }

      while (
        parseInt(newMonth[i][j].format("D")) !==
        parseInt(calendarState.month[dayNumber[0]][dayNumber[1]].format("D"))
      ) {
        i += op;
      }

      setDayNumber([op < 0 ? --i : ++i, op < 0 ? 6 : 0]);
      setWeekNumber(i);
    }
  };

  const changeDate = (op: number) => {
    if (mode === "month") {
      changeMonth(op);
    } else if (mode === "week") {
      changeWeek(op);
    } else {
      changeDay(op);
    }
  };

  return (
    <div className={"flex grow flex-col overflow-y-scroll"}>
      <header
        className={
          "flex h-16 w-full items-center justify-between border-b border-solid border-negative p-4"
        }
      >
        <div className={"flex"}>
          <button
            className={"mr-2 rounded-md bg-secondary px-4 text-negative"}
            onClick={() => {
              const index = parseInt(dayjs().format("M")) - 1;
              const month = generateMonth(index);

              dispatch(
                updateCalendar({
                  index,
                  month,
                }),
              );

              month.forEach((week, i) => {
                week.forEach((day, j) => {
                  if (day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")) {
                    setWeekNumber(i);
                    setDayNumber([i, j]);
                  }
                });
              });
            }}
          >
            Today
          </button>
          <div className={"flex"}>
            <button
              className={
                "rounded-bl-md rounded-tl-md border-r border-solid border-negative bg-secondary px-4"
              }
              onClick={() => changeDate(-1)}
            >
              <FaChevronLeft className={"text-sm text-negative"} />
            </button>
            <button
              className={"rounded-br-md rounded-tr-md bg-secondary px-4"}
              onClick={() => changeDate(1)}
            >
              <FaChevronRight className={"text-sm text-negative"} />
            </button>
          </div>
          <p className={"px-4 text-2xl font-semibold text-negative"}>
            {renderHeader()}
          </p>
        </div>
        <div className={"flex"}>
          <button
            className={`${
              mode === "month"
                ? "bg-negative text-primary"
                : "bg-secondary text-negative"
            } rounded-bl-md rounded-tl-md border-r border-solid border-negative px-4 py-1 font-semibold`}
            onClick={() => setMode("month")}
          >
            Month
          </button>
          <button
            className={`${
              mode === "week"
                ? "bg-negative text-primary"
                : "bg-secondary text-negative"
            } px-4 py-1 font-semibold`}
            onClick={() => setMode("week")}
          >
            Week
          </button>
          <button
            className={`${
              mode === "day"
                ? "bg-negative text-primary"
                : "bg-secondary text-negative"
            } rounded-br-md rounded-tr-md border-l border-solid border-negative px-4 py-1 font-semibold`}
            onClick={() => setMode("day")}
          >
            Day
          </button>
        </div>
      </header>
      <div className={"flex grow flex-col"}>{renderMode()}</div>
    </div>
  );
};
