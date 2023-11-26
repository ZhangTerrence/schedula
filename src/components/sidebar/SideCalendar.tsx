import { Fragment, useState } from "react";
import { type CalendarState, updateCalendar } from "../../store/calendarSlice";
import generateMonth from "../../utilities/generateMonth";
import dayjs from "dayjs";
import { useRedux } from "../../hooks/useRedux";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export const SideCalendar = () => {
  const { useAppDispatch, useAppSelector } = useRedux();
  const calendarState = useAppSelector((state) => state.calendar);
  const [sideCalendar, setSideCalendar] =
    useState<CalendarState>(calendarState);
  const [selectedDay, setSelectedDay] = useState(dayjs().format("DD-MM-YY"));
  const dispatch = useAppDispatch();

  const isSelectedDay = (day: dayjs.Dayjs) => {
    return day.format("DD-MM-YY") === selectedDay;
  };

  const isCurrentMonth = (day: dayjs.Dayjs) => {
    return parseInt(day.format("MM")) === (sideCalendar.current.month % 12) + 1;
  };

  const isToday = (day: dayjs.Dayjs) => {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY");
  };

  const changeDate = (day: dayjs.Dayjs, i: number, j: number) => {
    if (i <= 1 && parseInt(day.format("D")) >= 14) {
      let month = sideCalendar.current.month - 1;
      console.log(month);
      const array = generateMonth(month);

      for (let i = 4; i <= 5; i++) {
        for (let j = 0; j <= 6; j++) {
          if (array[i][j].format("D") === day.format("D")) {
            setSelectedDay(array[i][j].format("DD-MM-YY"));

            setSideCalendar({
              array,
              current: {
                month,
                week: i,
                day: j,
              },
            });

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
    } else if (i >= 4 && parseInt(day.format("D")) <= 14) {
      let month = sideCalendar.current.month + 1;
      const array = generateMonth(month);

      for (let i = 0; i <= 1; i++) {
        for (let j = 0; j <= 6; j++) {
          if (array[i][j].format("D") === day.format("D")) {
            setSelectedDay(array[i][j].format("DD-MM-YY"));

            setSideCalendar({
              array,
              current: {
                month,
                week: i,
                day: j,
              },
            });

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

    const month = sideCalendar.current.month;
    setSelectedDay(day.format("DD-MM-YY"));
    setSideCalendar((calendar) => {
      return {
        ...calendar,
        current: {
          month,
          week: i,
          day: j,
        },
      };
    });
    dispatch(
      updateCalendar({
        ...calendarState,
        current: {
          month,
          week: i,
          day: j,
        },
      }),
    );
  };

  return (
    <div
      className={
        "flex w-full flex-col items-center gap-y-4 overflow-y-scroll px-4 pb-4"
      }
    >
      <div className={"w-full space-y-2"}>
        <header className={"relative w-full px-4"}>
          <button
            className={"absolute bottom-0 left-0 top-0 m-auto ml-4"}
            onClick={() =>
              setSideCalendar((calendar) => {
                const month = calendar.current.month - 1;

                return {
                  array: generateMonth(month),
                  current: {
                    ...calendar.current,
                    month,
                  },
                };
              })
            }
          >
            <FaChevronLeft className={"text-xl text-negative"} />
          </button>
          <p className={"text-center text-xl text-negative"}>
            {dayjs(new Date(dayjs().year(), sideCalendar.current.month)).format(
              "MMMM YYYY",
            )}
          </p>
          <button
            className={"absolute bottom-0 right-0 top-0 m-auto mr-4"}
            onClick={() =>
              setSideCalendar((calendar) => {
                const month = calendar.current.month + 1;

                return {
                  array: generateMonth(month),
                  current: {
                    ...calendar.current,
                    month,
                  },
                };
              })
            }
          >
            <FaChevronRight className={"text-xl text-negative"} />
          </button>
        </header>
        <div className={"grid grid-cols-7 grid-rows-7"}>
          {sideCalendar.array[0].map((day) => {
            const weekday = day.format("ddd");
            return (
              <p
                className={"select-none py-2 text-center text-sm text-negative"}
                key={weekday}
              >
                {weekday}
              </p>
            );
          })}
          {sideCalendar.array.map((week, i) => {
            return (
              <Fragment key={i}>
                {week.map((day, j) => {
                  return (
                    <button
                      onClick={() => changeDate(day, i, j)}
                      key={`${i}-${day.format("DD")}`}
                    >
                      <p
                        className={`
                          ${
                            isCurrentMonth(day)
                              ? "text-negative"
                              : "text-tertiary"
                          } 
                          ${isSelectedDay(day) ? "bg-accent" : ""} 
                          ${isToday(day) ? "bg-accent-secondary" : ""} 
                          rounded-full text-center`}
                      >
                        {day.format("DD")}
                      </p>
                    </button>
                  );
                })}
              </Fragment>
            );
          })}
        </div>
      </div>
      <div className={"w-full space-y-2"}>
        <h1 className={"text-center text-xl text-negative underline"}>
          Events
        </h1>
        <div></div>
      </div>
    </div>
  );
};