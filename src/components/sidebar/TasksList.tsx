import { useRedux } from "../../hooks/useRedux";
import { IoCheckmarkCircleSharp, IoAddCircleSharp } from "react-icons/io5";
import supabase from "../../config/supabase";
import { Task, updateTask } from "../../store/tasksSlice";

export const TasksList = () => {
  const { useAppSelector, useAppDispatch } = useRedux();
  const tasksState = useAppSelector((state) => state.tasks.tasks);
  const dispatch = useAppDispatch();

  return (
    <div
      className={
        "flex w-full flex-col items-center gap-y-4 overflow-y-scroll px-4 pb-4"
      }
    >
      <h1 className={"text-center text-xl text-negative underline"}>Tasks</h1>
      <div className={"flex w-full grow flex-col gap-y-4 overflow-scroll"}>
        {tasksState.map((task, i) => {
          if (new Date(task.date).getDate() < new Date().getDate() - 1) {
            return null;
          }

          const markCompleted = async () => {
            const { data, error } = await supabase
              .from("tasks")
              .update({
                completed: true,
              })
              .eq("id", task.id)
              .select();

            if (error) {
              window.alert(error);
            } else {
              dispatch(updateTask(data[0] as Task));
            }
          };

          const markUncompleted = async () => {
            const { data, error } = await supabase
              .from("tasks")
              .update({
                completed: false,
              })
              .eq("id", task.id)
              .select();

            if (error) {
              window.alert(error);
            } else {
              dispatch(updateTask(data[0] as Task));
            }
          };

          return (
            <div
              className={"relative"}
              key={i}
              onClick={() => {
                if (task.completed) {
                  markUncompleted();
                } else {
                  markCompleted();
                }
              }}
            >
              <button
                className={`${
                  task.completed ? "bg-blue-950" : "bg-blue-700"
                } w-full rounded-md p-2 text-start`}
                onClick={() => {}}
              >
                <div
                  className={
                    "relative overflow-hidden text-ellipsis text-negative"
                  }
                >
                  <div>{task.title}</div>
                  <div
                    className={
                      "absolute bottom-0 right-0 top-0 flex items-center text-xl text-negative"
                    }
                  >
                    {task.completed ? (
                      <IoAddCircleSharp className={"rotate-45"} />
                    ) : (
                      <IoCheckmarkCircleSharp />
                    )}
                  </div>
                </div>
                <div className={"line-clamp-4 break-words text-negative"}>
                  {task.description}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
