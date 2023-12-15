import { useRef, useState } from "react";
import { useSession } from "../../hooks/useSession";
import { useRedux } from "../../hooks/useRedux";
import { type Object, addTask } from "../../store/tasksSlice";
import { addEvent } from "../../store/eventsSlice";
import supabase from "../../config/supabase";
import dayjs from "dayjs";

export const CreatePopup = ({
  day,
  closePopup,
}: {
  day: dayjs.Dayjs;
  closePopup: () => void;
}) => {
  const { session } = useSession();

  const { useAppDispatch } = useRedux();
  const dispatch = useAppDispatch();

  const [mode, setMode] = useState<"events" | "tasks">("events");
  const backdropRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const create = async () => {
    if (!titleRef.current) {
      window.alert("Title is required.");
      return;
    }

    const { data, error } = await supabase
      .from(`${mode}`)
      .insert({
        user_id: session?.user.id,
        title: titleRef.current.value,
        date: day,
        description: descriptionRef.current?.value ?? "",
      })
      .select();

    if (error) {
      alert(error.message);
    } else {
      titleRef.current.value = "";
      if (descriptionRef.current) {
        descriptionRef.current.value = "";
      }
      if (mode === "events") {
        dispatch(addEvent(data[0] as Object));
      } else {
        dispatch(addTask(data[0] as Object));
      }
      closePopup();
    }
  };

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
          "absolute inset-0 m-auto flex h-fit w-fit flex-col gap-y-4 rounded-md border border-solid border-negative bg-primary p-4"
        }
      >
        <h1 className={"text-3xl text-negative underline"}>
          {dayjs(day).format("MMMM DD, YYYY")}
        </h1>
        <input
          className={
            "border-b border-solid border-negative bg-transparent pb-2 text-3xl text-negative outline-none"
          }
          type="text"
          placeholder={"Add title"}
          ref={titleRef}
        />
        <div className={"flex w-fit justify-between space-x-2 rounded-md p-1"}>
          <button
            className={`${
              mode === "events"
                ? "bg-negative text-primary"
                : "bg-secondary text-negative"
            } rounded-md px-4 py-2 text-lg font-semibold`}
            onClick={(e) => {
              e.preventDefault();
              setMode("events");
            }}
          >
            Event
          </button>
          <button
            className={`${
              mode === "tasks"
                ? "bg-negative text-primary"
                : "bg-secondary text-negative"
            } rounded-md px-4 py-2 text-lg font-semibold`}
            onClick={(e) => {
              e.preventDefault();
              setMode("tasks");
            }}
          >
            Task
          </button>
        </div>
        <textarea
          className={
            "max-h-60 min-h-[3rem] bg-transparent text-negative outline-none"
          }
          placeholder={"Add description..."}
          ref={descriptionRef}
        ></textarea>
        <div className={"flex space-x-2 self-end"}>
          <button
            className={
              "rounded-md border border-solid border-negative px-4 py-2 text-negative"
            }
            onClick={() => closePopup()}
          >
            Cancel
          </button>
          <button
            className={
              "rounded-md border border-solid border-negative px-4 py-2 text-negative"
            }
            onClick={(e) => {
              e.preventDefault();
              create();
            }}
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
};
