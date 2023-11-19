import { Fragment, useState } from "react";
import { type CalendarState, updateCalendar } from "../../store/calendarSlice";
import generateMonth from "../../utilities/generateMonth";
import dayjs from "dayjs";
import { useRedux } from "../../hooks/useRedux";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export const SideCalendar = () => {
  const [sideCalendar, setSideCalendar] = useState<CalendarState>({
    index: dayjs().month(),
    month: generateMonth(),
  });
  const { useAppDispatch } = useRedux();
  const dispatch = useAppDispatch();

  const isCurrentMonth = (day: dayjs.Dayjs) => {
    return parseInt(day.format("MM")) === (sideCalendar.index % 12) + 1;
  };

  const isToday = (day: dayjs.Dayjs) => {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY");
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
              setSideCalendar((prev) => {
                return {
                  index: prev.index - 1,
                  month: generateMonth(prev.index - 1),
                };
              })
            }
          >
            <FaChevronLeft className={"text-xl text-negative"} />
          </button>
          <p className={"text-center text-xl text-negative"}>
            {dayjs(new Date(dayjs().year(), sideCalendar.index)).format(
              "MMMM YYYY",
            )}
          </p>
          <button
            className={"absolute bottom-0 right-0 top-0 m-auto mr-4"}
            onClick={() =>
              setSideCalendar((prev) => {
                return {
                  index: prev.index + 1,
                  month: generateMonth(prev.index + 1),
                };
              })
            }
          >
            <FaChevronRight className={"text-xl text-negative"} />
          </button>
        </header>
        <div className={"grid grid-cols-7 grid-rows-7"}>
          {sideCalendar.month[0].map((day) => {
            const weekday = day.format("dd");
            return (
              <p
                className={"select-none py-2 text-center text-sm text-negative"}
                key={weekday}
              >
                {weekday}
              </p>
            );
          })}
          {sideCalendar.month.map((week, i) => {
            return (
              <Fragment key={i}>
                {week.map((day) => {
                  const date = day.format("DD");
                  return (
                    <button
                      onClick={() => dispatch(updateCalendar(sideCalendar))}
                      key={`${i}-${date}`}
                    >
                      <p
                        className={`
                          ${
                            isCurrentMonth(day)
                              ? "text-negative"
                              : "text-secondary"
                          } 
                          ${isToday(day) ? "bg-accent" : ""} 
                          rounded-full text-center`}
                      >
                        {date}
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
