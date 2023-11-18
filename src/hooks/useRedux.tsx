import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";

export const useRedux = () => {
  const useAppDispatch: () => AppDispatch = useDispatch;
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

  return { useAppDispatch, useAppSelector };
};
