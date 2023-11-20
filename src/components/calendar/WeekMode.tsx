import { Day } from "./Day";
import dayjs from "dayjs";

export const WeekMode = ({ week }: { week: dayjs.Dayjs[] }) => {
  return (
    <>
      <header className={"grid grid-cols-7"}>
        {week.map((day) => {
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
      <div className={"grid grow grid-cols-7"}>
        {week.map((day, i) => {
          return <Day key={`${i}-${day.format("DD")}`} day={day} />;
        })}
      </div>
    </>
  );
};
