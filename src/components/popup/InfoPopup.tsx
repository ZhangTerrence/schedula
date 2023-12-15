import { useRef } from "react";
import type { Object } from "../../store/tasksSlice";
import dayjs from "dayjs";

export const InfoPopup = ({
  info,
  closePopup,
}: {
  info: Object | null;
  closePopup: () => void;
}) => {
  const backdropRef = useRef<HTMLDivElement>(null);

  if (!info) {
    return null;
  }

  return (
    <div
      className={"fixed left-0 top-0 z-50 h-screen w-screen backdrop-blur-sm"}
      onClick={(e) => {
        if (e.target === backdropRef.current) {
          closePopup();
        }
      }}
      ref={backdropRef}
    >
      <form
        className={
          "absolute inset-0 m-auto flex h-fit max-h-[30rem] w-[25rem] flex-col gap-y-4 overflow-y-scroll rounded-md border border-solid border-negative bg-primary p-4"
        }
      >
        <h1 className={"text-3xl text-negative underline"}>
          {dayjs(new Date(info.date)).format("MMMM DD, YYYY")}
        </h1>
        <h2
          className={
            "line-clamp-2 overflow-y-scroll break-words text-2xl text-negative"
          }
        >
          {info.title}
        </h2>
        <p className={"break-words text-negative"}>{info.description}</p>
      </form>
    </div>
  );
};
