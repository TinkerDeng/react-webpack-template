/**
 * Created by dfc on 2018/5/16
 */
import { push } from "react-router-redux";

export const SHOW = "SHOW";
export const HIDE = "HIDE";

export function show() {
  return (dispatch, getState) => {
    dispatch({ type: SHOW });
  };
}

export function hide() {
  return { type: HIDE };
}
