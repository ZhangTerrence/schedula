import { useRedux } from "../../hooks/useRedux";
import dayjs from "dayjs";

export const Day = ({ day }: { day: dayjs.Dayjs }) => {
  const { useAppSelector } = useRedux();
  const calendarState = useAppSelector((state) => state.calendar);

  const isCurrentMonth = (day: dayjs.Dayjs) => {
    return parseInt(day.format("MM")) === (calendarState.index % 12) + 1;
  };

  const isToday = (day: dayjs.Dayjs) => {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY");
  };

  return (
    <div
      className={
        "flex flex-col items-center border border-solid border-secondary p-1"
      }
    >
      <button
        className={`
          ${isCurrentMonth(day) ? "text-negative" : "text-tertiary"} 
          ${isToday(day) ? "bg-accent-secondary" : ""} 
          w-12 rounded-full text-center`}
      >
        {day.format("DD")}
      </button>
    </div>
  );
};
