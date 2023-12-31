import { useState, useRef } from "react";
import { useSession } from "../../hooks/useSession";
import { useRedux } from "../../hooks/useRedux";
import {
  type Task,
  addTask,
  updateTask,
  deleteTask,
} from "../../store/tasksSlice";
import {
  type Event,
  addEvent,
  updateEvent,
  deleteEvent,
} from "../../store/eventsSlice";
import { IoPencilSharp, IoTrashBinSharp } from "react-icons/io5";
import supabase from "../../config/supabase";
import dayjs from "dayjs";

export const InfoPopup = ({
  info,
  closePopup,
}: {
  info: Task | Event | null;
  closePopup: () => void;
}) => {
  const { session } = useSession();

  const { useAppDispatch } = useRedux();
  const dispatch = useAppDispatch();

  const [editing, setEditing] = useState(false);

  const backdropRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  if (!info) {
    return null;
  }

  let type = "events";
  if ((info as Task).completed !== undefined) {
    type = "tasks";
  }

  const [infoType, setInfoType] = useState(type);

  const deleteInfo = async () => {
    if (!type) {
      window.alert("Error.");
      return;
    }

    const { error } = await supabase.from(type).delete().eq("id", info.id);
    if (error) {
      window.alert(error.message);
    } else {
      if (type === "tasks") {
        dispatch(deleteTask(info as Task));
      } else {
        dispatch(deleteEvent(info as Event));
      }
      closePopup();
    }
  };

  const updateInfo = async () => {
    if (!titleRef.current) {
      window.alert("Title is required.");
      return;
    }

    if (infoType !== type) {
      try {
        await supabase.from(type).delete().eq("id", info.id);
        const { data } = await supabase
          .from(`${infoType}`)
          .insert({
            user_id: session?.user.id,
            title: titleRef.current.value,
            date: info.date,
            description: descriptionRef.current?.value ?? "",
          })
          .select();

        if (!data) {
          throw Error("Error updating.");
        }

        if (infoType === "tasks") {
          dispatch(deleteEvent(info as Event));
          dispatch(addTask(data[0] as Task));
        } else {
          dispatch(deleteTask(info as Task));
          dispatch(addEvent(data[0] as Event));
        }
      } catch (error) {
        window.alert(error);
      }
    } else {
      const { data, error } = await supabase
        .from(infoType)
        .update({
          user_id: session?.user.id,
          title: titleRef.current.value,
          date: info.date,
          description: descriptionRef.current?.value ?? "",
        })
        .eq("id", info.id)
        .select();

      if (error) {
        window.alert(error);
      } else {
        if (infoType === "tasks") {
          dispatch(updateTask(data[0] as Task));
        } else {
          dispatch(updateEvent(data[0] as Event));
        }
      }
    }

    setEditing(false);
    closePopup();
  };

  const markCompleted = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .update({
        completed: true,
      })
      .eq("id", info.id)
      .select();

    if (error) {
      window.alert(error);
    } else {
      dispatch(updateTask(data[0] as Task));
    }

    closePopup();
  };

  const markUncompleted = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .update({
        completed: false,
      })
      .eq("id", info.id)
      .select();

    if (error) {
      window.alert(error);
    } else {
      dispatch(updateTask(data[0] as Task));
    }

    closePopup();
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
          "absolute inset-0 m-auto flex h-fit max-h-[30rem] w-[25rem] flex-col gap-y-4 overflow-y-scroll rounded-md border border-solid border-negative bg-primary p-4"
        }
      >
        <h1 className={"text-3xl text-negative underline"}>
          {dayjs(new Date(info.date)).format("MMMM DD, YYYY")}
        </h1>
        {editing ? (
          <>
            <input
              className={
                "border-b border-solid border-negative bg-transparent pb-2 text-3xl text-negative outline-none"
              }
              type="text"
              placeholder={"Add title"}
              defaultValue={info.title}
              ref={titleRef}
            />
            <div
              className={"flex w-fit justify-between space-x-2 rounded-md p-1"}
            >
              <button
                className={`${
                  infoType === "events"
                    ? "bg-negative text-primary"
                    : "bg-secondary text-negative"
                } rounded-md px-4 py-2 text-lg font-semibold`}
                onClick={(e) => {
                  e.preventDefault();
                  setInfoType("events");
                }}
              >
                Event
              </button>
              <button
                className={`${
                  infoType === "tasks"
                    ? "bg-negative text-primary"
                    : "bg-secondary text-negative"
                } rounded-md px-4 py-2 text-lg font-semibold`}
                onClick={(e) => {
                  e.preventDefault();
                  setInfoType("tasks");
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
              defaultValue={info.description}
              ref={descriptionRef}
            ></textarea>
            <div className={"flex space-x-2 self-end"}>
              <button
                className={
                  "rounded-md border border-solid border-negative px-4 py-2 text-negative"
                }
                onClick={() => {
                  setInfoType(type);
                  setEditing(false);
                }}
              >
                Cancel
              </button>
              <button
                className={
                  "rounded-md border border-solid border-negative px-4 py-2 text-negative"
                }
                onClick={(e) => {
                  e.preventDefault();
                  updateInfo();
                }}
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <>
            <h2
              className={
                "line-clamp-2 overflow-y-scroll break-words text-2xl text-negative"
              }
            >
              {info.title}
            </h2>
            <p className={"break-words text-negative"}>{info.description}</p>
            <div
              className={
                "absolute right-0 top-0 m-4 flex gap-x-2 text-2xl text-negative"
              }
            >
              <IoPencilSharp
                className={"hover:text-slate-500"}
                onClick={() => setEditing(true)}
              />
              <IoTrashBinSharp
                className={"hover:text-red-500"}
                onClick={() => deleteInfo()}
              />
            </div>
            {type === "tasks" ? (
              (info as Task).completed ? (
                <button
                  className={
                    "self-end rounded-md border border-solid border-negative px-2 py-1 text-negative"
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    markUncompleted();
                  }}
                >
                  Mark as uncompleted
                </button>
              ) : (
                <button
                  className={
                    "self-end rounded-md border border-solid border-negative px-2 py-1 text-negative"
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    markCompleted();
                  }}
                >
                  Mark as completed
                </button>
              )
            ) : null}
          </>
        )}
      </form>
    </div>
  );
};
