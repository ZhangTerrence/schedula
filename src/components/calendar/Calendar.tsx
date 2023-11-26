import { useState, useEffect, useCallback } from "react";
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
  const { useAppDispatch, useAppSelector } = useRedux();
  const calendarState = useAppSelector((state) => state.calendar);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const week = calendarState.array.filter((week) =>
      week
        .map((day) => day.format("DD-MM-YY"))
        .includes(dayjs().format("DD-MM-YY")),
    )[0];

    const i = calendarState.array.indexOf(week);

    let j = 0;
    while (j <= 6) {
      if (
        calendarState.array[i][j].format("DD-MM-YY") ===
        dayjs().format("DD-MM-YY")
      ) {
        break;
      }
      j++;
    }

    dispatch(
      updateCalendar({
        ...calendarState,
        current: {
          ...calendarState.current,
          week: i,
          day: j,
        },
      }),
    );
  }, []);

  const renderHeader = useCallback(() => {
    if (mode === "month") {
      return dayjs(
        new Date(dayjs().year(), calendarState.current.month),
      ).format("MMMM YYYY");
    } else if (mode === "week") {
      if (
        parseInt(
          calendarState.array[calendarState.current.week][6].format("D"),
        ) <
        parseInt(calendarState.array[calendarState.current.week][0].format("D"))
      ) {
        return `${calendarState.array[calendarState.current.week][0].format(
          "MMM",
        )}-${calendarState.array[calendarState.current.week][6].format(
          "MMM YYYY",
        )}`;
      } else {
        return calendarState.array[calendarState.current.week][6].format(
          "MMMM YYYY",
        );
      }
    } else {
      return calendarState.array[calendarState.current.week][
        calendarState.current.day
      ].format("MMMM YYYY");
    }
  }, [calendarState, mode]);

  const renderMode = useCallback(() => {
    if (mode === "month") {
      return <MonthMode month={calendarState.array} />;
    } else if (mode === "week") {
      return (
        <WeekMode week={calendarState.array[calendarState.current.week]} />
      );
    } else
      return (
        <DayMode
          day={
            calendarState.array[calendarState.current.week][
              calendarState.current.day
            ]
          }
        />
      );
  }, [calendarState, mode]);

  const changeMonth = (op: number) => {
    const month = calendarState.current.month + op;

    dispatch(
      updateCalendar({
        array: generateMonth(month),
        current: {
          ...calendarState.current,
          month,
        },
      }),
    );
  };

  const changeWeek = (op: number) => {
    let condition;

    if (op < 0) {
      condition = calendarState.current.week >= 1;
    } else {
      condition = calendarState.current.week <= 4;
    }

    if (condition) {
      dispatch(
        updateCalendar({
          ...calendarState,
          current: {
            ...calendarState.current,
            week: calendarState.current.week + op,
          },
        }),
      );
    } else {
      const month = calendarState.current.month + op;

      dispatch(
        updateCalendar({
          array: generateMonth(month),
          current: {
            ...calendarState.current,
            month,
            week: op < 0 ? 3 : 2,
          },
        }),
      );
    }
  };

  const changeDay = (op: number) => {
    let condition1;
    let condition2;
    const oldDay = parseInt(
      calendarState.array[calendarState.current.week][
        calendarState.current.day
      ].format("D"),
    );

    const check = (day: dayjs.Dayjs) => {
      const newDay = parseInt(day.format("D"));
      return op < 0 ? oldDay < newDay : oldDay > newDay;
    };

    const findIndex = (array: dayjs.Dayjs[][], day: dayjs.Dayjs) => {
      let i;
      let j;

      if (op < 0) {
        i = 5;
        j = 6;
      } else {
        i = 0;
        j = 0;
      }

      while (parseInt(array[i][j].format("D")) !== parseInt(day.format("D"))) {
        if (op < 0) {
          if (j === 0) {
            i--;
            j = 6;
          } else {
            j--;
          }
        } else {
          if (j === 6) {
            i++;
            j = 0;
          } else {
            j++;
          }
        }
      }

      return [i, j];
    };

    if (op < 0) {
      condition1 = calendarState.current.week >= 1;
      condition2 = calendarState.current.day >= 1;
    } else {
      condition1 = calendarState.current.week <= 4;
      condition2 = calendarState.current.day <= 5;
    }

    if ((condition1 && condition2) || (!condition1 && condition2)) {
      const newMonth = check(
        calendarState.array[calendarState.current.week][
          calendarState.current.day + op
        ],
      );

      if (newMonth) {
        const index = findIndex(
          generateMonth(calendarState.current.month + op),
          calendarState.array[calendarState.current.week][
            calendarState.current.day + op
          ],
        );
        dispatch(
          updateCalendar({
            array: generateMonth(calendarState.current.month + op),
            current: {
              month: calendarState.current.month + op,
              week: index[0],
              day: index[1],
            },
          }),
        );
      } else {
        dispatch(
          updateCalendar({
            ...calendarState,
            current: {
              ...calendarState.current,
              day: calendarState.current.day + op,
            },
          }),
        );
      }
    } else if (condition1 && !condition2) {
      if (op < 0) {
        const newMonth = check(
          calendarState.array[calendarState.current.week - 1][6],
        );

        if (newMonth) {
          const index = findIndex(
            generateMonth(calendarState.current.month + op),
            calendarState.array[calendarState.current.week][
              calendarState.current.day + op
            ],
          );

          dispatch(
            updateCalendar({
              array: generateMonth(calendarState.current.month + op),
              current: {
                month: calendarState.current.month + op,
                week: index[0],
                day: index[1],
              },
            }),
          );
        } else {
          dispatch(
            updateCalendar({
              ...calendarState,
              current: {
                ...calendarState.current,
                month: newMonth
                  ? calendarState.current.month + op
                  : calendarState.current.month,
                week: calendarState.current.week - 1,
                day: 6,
              },
            }),
          );
        }
      } else {
        const newMonth = check(
          calendarState.array[calendarState.current.week + 1][0],
        );

        if (newMonth) {
          const index = findIndex(
            generateMonth(calendarState.current.month + op),
            calendarState.array[calendarState.current.week][
              calendarState.current.day + op
            ],
          );

          dispatch(
            updateCalendar({
              array: generateMonth(calendarState.current.month + op),
              current: {
                month: calendarState.current.month + op,
                week: index[0],
                day: index[1],
              },
            }),
          );
        } else {
          dispatch(
            updateCalendar({
              ...calendarState,
              current: {
                ...calendarState.current,
                month: newMonth
                  ? calendarState.current.month + op
                  : calendarState.current.month,
                week: calendarState.current.week + 1,
                day: 0,
              },
            }),
          );
        }
      }
    } else if (!condition1 && !condition2) {
      dispatch(
        updateCalendar({
          array: generateMonth(calendarState.current.month + op),
          current: {
            month: calendarState.current.month + op,
            week: op < 0 ? 4 : 1,
            day: op < 0 ? 6 : 0,
          },
        }),
      );
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
            className={
              "mr-2 rounded-md border border-solid border-negative px-4 font-bold tracking-wider text-negative"
            }
            onClick={() => {
              const month = parseInt(dayjs().format("M")) - 1;
              const array = generateMonth(month);

              const week = array.filter((week) =>
                week
                  .map((day) => day.format("DD-MM-YY"))
                  .includes(dayjs().format("DD-MM-YY")),
              )[0];

              const i = array.indexOf(week);

              let j = 0;
              while (j <= 6) {
                if (
                  array[i][j].format("DD-MM-YY") === dayjs().format("DD-MM-YY")
                ) {
                  break;
                }
                j++;
              }

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
            }}
          >
            Today
          </button>
          <div className={"flex"}>
            <button
              className={
                "rounded-bl-md rounded-tl-md border border-solid border-negative px-4 text-negative"
              }
              onClick={() => changeDate(-1)}
            >
              <FaChevronLeft className={"text-sm text-negative"} />
            </button>
            <button
              className={
                "rounded-br-md rounded-tr-md border border-solid border-negative px-4 text-negative"
              }
              onClick={() => changeDate(1)}
            >
              <FaChevronRight className={"text-sm text-negative"} />
            </button>
          </div>
          <p className={"px-4 text-2xl font-bold text-negative"}>
            {renderHeader()}
          </p>
        </div>
        <div className={"flex"}>
          <button
            className={`${
              mode === "month" ? "bg-negative text-primary" : "text-negative"
            } rounded-bl-md rounded-tl-md border border-solid border-negative px-4 py-1 font-bold`}
            onClick={() => setMode("month")}
          >
            Month
          </button>
          <button
            className={`${
              mode === "week" ? "bg-negative text-primary" : "text-negative"
            } border border-solid border-negative px-4 py-1 font-bold`}
            onClick={() => setMode("week")}
          >
            Week
          </button>
          <button
            className={`${
              mode === "day" ? "bg-negative text-primary" : "text-negative"
            } rounded-br-md rounded-tr-md border border-solid border-negative px-4 py-1 font-bold`}
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