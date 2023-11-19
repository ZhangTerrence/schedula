import { Fragment } from "react";
import dayjs from "dayjs";
import { CalendarDay } from "./CalendarDay";
import { useRedux } from "../../hooks/useRedux";
import { updateCalendar } from "../../store/calendarSlice";
import generateMonth from "../../utilities/generateMonth";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export const Calendar = () => {
  const { useAppDispatch, useAppSelector } = useRedux();
  const calendarState = useAppSelector((state) => state.calendar);
  const dispatch = useAppDispatch();

  return (
    <div className={"flex grow flex-col overflow-y-scroll"}>
      <header
        className={
          "flex h-16 w-full items-center border-b border-solid border-negative p-4"
        }
      >
        <div className={"flex"}>
          <button
            className={
              "mr-2 rounded-md bg-secondary px-4 text-lg text-negative"
            }
            onClick={() =>
              dispatch(
                updateCalendar({
                  index: dayjs().month(),
                  month: generateMonth(),
                }),
              )
            }
          >
            Today
          </button>
          <div className={"flex"}>
            <button
              className={
                "rounded-bl-md rounded-tl-md border-r border-solid border-negative bg-secondary px-4"
              }
              onClick={() =>
                dispatch(
                  updateCalendar({
                    index: calendarState.index - 1,
                    month: generateMonth(calendarState.index - 1),
                  }),
                )
              }
            >
              <FaChevronLeft className={"text-sm text-negative"} />
            </button>
            <button
              className={"rounded-br-md rounded-tr-md bg-secondary px-4"}
              onClick={() =>
                dispatch(
                  updateCalendar({
                    index: calendarState.index + 1,
                    month: generateMonth(calendarState.index + 1),
                  }),
                )
              }
            >
              <FaChevronRight className={"text-sm text-negative"} />
            </button>
          </div>
          <p className={"px-4 text-2xl font-semibold text-negative"}>
            {dayjs(new Date(dayjs().year(), calendarState.index)).format(
              "MMMM YYYY",
            )}
          </p>
        </div>
      </header>
      <div className={"flex grow flex-col"}>
        <header className={"grid grid-cols-7"}>
          {calendarState.month[0].map((day) => {
            const weekday = day.format("ddd");
            return (
              <p
                className={
                  "select-none border border-solid border-secondary py-2 text-center text-lg text-negative"
                }
                key={weekday}
              >
                {weekday}
              </p>
            );
          })}
        </header>
        <div className={"grid grow grid-cols-7 grid-rows-6"}>
          {calendarState.month.map((week, i) => {
            return (
              <Fragment key={i}>
                {week.map((day) => {
                  return (
                    <CalendarDay key={`${i}-${day.format("DD")}`} day={day} />
                  );
                })}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
