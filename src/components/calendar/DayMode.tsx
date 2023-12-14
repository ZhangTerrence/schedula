import dayjs from "dayjs";
import { Day } from "./Day";

export const DayMode = ({
  day,
  localWeek,
  localDay,
}: {
  day: dayjs.Dayjs;
  localWeek: number;
  localDay: number;
}) => {
  return (
    <>
      <header>
        <p
          className={
            "select-none border border-solid border-secondary px-4 py-2 text-lg text-negative"
          }
        >
          {day.format("dddd, MMMM D")}
        </p>
      </header>
      <Day day={day} localWeek={localWeek} localDay={localDay} mode={"day"} />
    </>
  );
};
