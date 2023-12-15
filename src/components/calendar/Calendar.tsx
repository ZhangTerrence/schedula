import { useEffect, useCallback } from "react";
import { useRedux } from "../../hooks/useRedux";
import { changeMode } from "../../store/modeSlice";
import { updateCalendar } from "../../store/calendarSlice";
import { DayMode } from "./DayMode";
import { WeekMode } from "./WeekMode";
import { MonthMode } from "./MonthMode";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import dayjs from "dayjs";
import generateMonth from "../../utilities/generateMonth";

export const Calendar = () => {
  const { useAppDispatch, useAppSelector } = useRedux();
  const modeState = useAppSelector((state) => state.mode.mode);
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
    if (modeState === "month") {
      return dayjs(
        new Date(dayjs().year(), calendarState.current.month),
      ).format("MMMM YYYY");
    } else if (modeState === "week") {
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
  }, [calendarState, modeState]);

  const renderMode = useCallback(() => {
    if (modeState === "month") {
      return <MonthMode month={calendarState.array} />;
    } else if (modeState === "week") {
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
          localWeek={calendarState.current.week}
          localDay={calendarState.current.day}
        />
      );
  }, [calendarState, modeState]);

  const changeMonth = (op: number) => {
    const month = calendarState.current.month + op;

    dispatch(
      updateCalendar({
        array: generateMonth(month),
        current: {
          month,
          week: 0,
          day: 0,
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

      while (array[i][j].format("D") !== day.format("D")) {
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
    if (modeState === "month") {
      changeMonth(op);
    } else if (modeState === "week") {
      changeWeek(op);
    } else {
      changeDay(op);
    }
  };

  return (
    <div
      className={
        "flex h-full max-h-full w-4/5 max-w-[80%] flex-col overflow-x-hidden"
      }
    >
      <header
        className={
          "flex h-fit w-full items-center justify-between border-b border-solid border-negative p-4"
        }
      >
        <div className={"flex items-center"}>
          <button
            className={
              "mr-2 rounded-md border border-solid border-negative px-4 text-sm font-bold leading-8 text-negative"
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
                "h-fit rounded-bl-md rounded-tl-md border border-solid border-negative px-4 py-2 font-bold leading-8 text-negative"
              }
              onClick={() => changeDate(-1)}
            >
              <FaChevronLeft className={"text-sm text-negative"} />
            </button>
            <button
              className={
                "h-fit rounded-br-md rounded-tr-md border border-solid border-negative px-4 py-2 font-bold leading-8 text-negative"
              }
              onClick={() => changeDate(1)}
            >
              <FaChevronRight className={"text-sm text-negative"} />
            </button>
          </div>
          <p className={"px-4 text-xl font-bold text-negative"}>
            {renderHeader()}
          </p>
        </div>
        <div className={"flex"}>
          <button
            className={`${
              modeState === "month"
                ? "bg-negative text-primary"
                : "text-negative"
            } rounded-bl-md rounded-tl-md border border-solid border-negative px-4 py-1 font-bold`}
            onClick={() => {
              dispatch(
                changeMode({
                  mode: "month",
                }),
              );
            }}
          >
            Month
          </button>
          <button
            className={`${
              modeState === "week"
                ? "bg-negative text-primary"
                : "text-negative"
            } border border-solid border-negative px-4 py-1 font-bold`}
            onClick={() => {
              dispatch(
                changeMode({
                  mode: "week",
                }),
              );
            }}
          >
            Week
          </button>
          <button
            className={`${
              modeState === "day" ? "bg-negative text-primary" : "text-negative"
            } rounded-br-md rounded-tr-md border border-solid border-negative px-4 py-1 font-bold`}
            onClick={() => {
              dispatch(
                changeMode({
                  mode: "day",
                }),
              );
            }}
          >
            Day
          </button>
        </div>
      </header>
      <div className={"flex h-full max-h-full flex-col overflow-y-scroll"}>
        {renderMode()}
      </div>
    </div>
  );
};
