import { useRedux } from "../../hooks/useRedux";
import { Day } from "./Day";
import dayjs from "dayjs";

export const WeekMode = ({ week }: { week: dayjs.Dayjs[] }) => {
  const { useAppSelector } = useRedux();
  const calendarState = useAppSelector((state) => state.calendar);

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
        {week.map((day, j) => {
          return (
            <Day
              key={`${j}-${day.format("DD")}`}
              day={day}
              localWeek={calendarState.current.week}
              localDay={j}
              mode={"week"}
            />
          );
        })}
      </div>
    </>
  );
};
