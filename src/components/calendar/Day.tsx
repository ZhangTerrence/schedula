import { useRedux } from "../../hooks/useRedux";
import dayjs from "dayjs";
import { updateCalendar } from "../../store/calendarSlice";
import { changeMode } from "../../store/modeSlice";
import generateMonth from "../../utilities/generateMonth";

export const Day = ({
  day,
  localWeek,
  localDay,
}: {
  day: dayjs.Dayjs;
  localWeek: number;
  localDay: number;
}) => {
  const { useAppSelector, useAppDispatch } = useRedux();
  const calendarState = useAppSelector((state) => state.calendar);
  const dispatch = useAppDispatch();

  const isSelectedDay = (day: dayjs.Dayjs) => {
    return (
      day.format("DD-MM-YY") ===
      calendarState.array[calendarState.current.week][
        calendarState.current.day
      ].format("DD-MM-YY")
    );
  };

  const isCurrentMonth = (day: dayjs.Dayjs) => {
    return (
      parseInt(day.format("MM")) === (calendarState.current.month % 12) + 1
    );
  };

  const isToday = (day: dayjs.Dayjs) => {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY");
  };

  const changeDate = () => {
    if (localWeek <= 1 && parseInt(day.format("D")) >= 14) {
      let month = calendarState.current.month - 1;
      const array = generateMonth(month);

      for (let i = 4; i <= 5; i++) {
        for (let j = 0; j <= 6; j++) {
          if (array[i][j].format("D") === day.format("D")) {
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
    } else if (localWeek >= 4 && parseInt(day.format("D")) <= 14) {
      let month = calendarState.current.month + 1;
      const array = generateMonth(month);

      for (let i = 0; i <= 1; i++) {
        for (let j = 0; j <= 6; j++) {
          if (array[i][j].format("D") === day.format("D")) {
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

    const month = calendarState.current.month;

    dispatch(
      updateCalendar({
        ...calendarState,
        current: {
          month,
          week: localWeek,
          day: localDay,
        },
      }),
    );
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
          ${isSelectedDay(day) ? "bg-accent" : ""} 
          ${isToday(day) ? "bg-accent-secondary" : ""} 
          w-12 rounded-full text-center`}
        onClick={() => {
          changeDate();
          dispatch(
            changeMode({
              mode: "day",
            }),
          );
        }}
      >
        {day.format("DD")}
      </button>
    </div>
  );
};
