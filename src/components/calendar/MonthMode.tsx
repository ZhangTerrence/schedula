import { Fragment } from "react";
import { Day } from "./Day";
import dayjs from "dayjs";

export const MonthMode = ({ month }: { month: dayjs.Dayjs[][] }) => {
  return (
    <>
      <header className={"grid grid-cols-7"}>
        {month[0].map((day) => {
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
        {month.map((week, i) => {
          return (
            <Fragment key={i}>
              {week.map((day, j) => {
                return (
                  <Day
                    key={`${i}-${day.format("DD")}`}
                    day={day}
                    localWeek={i}
                    localDay={j}
                  />
                );
              })}
            </Fragment>
          );
        })}
      </div>
    </>
  );
};
