import { useRedux } from "../../hooks/useRedux";

export const EventsList = () => {
  const { useAppSelector } = useRedux();
  const eventsState = useAppSelector((state) => state.events.events);

  return (
    <div className={"flex w-full flex-col items-center gap-y-4 pb-4"}>
      <h1 className={"text-center text-xl text-negative underline"}>Events</h1>
      <div className={"flex w-full grow flex-col overflow-scroll px-3"}>
        {eventsState.map((event, j) => {
          return (
            <>
              <div
                className={
                  "border-b border-solid border-negative py-4 text-start"
                }
                key={j}
              >
                <div className={"overflow-hidden text-ellipsis text-negative"}>
                  {event.title}
                </div>
                <div className={"line-clamp-4 break-words text-negative"}>
                  {event.description}
                </div>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};
