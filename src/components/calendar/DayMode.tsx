import dayjs from "dayjs";

export const DayMode = ({ day }: { day: dayjs.Dayjs }) => {
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
    </>
  );
};
