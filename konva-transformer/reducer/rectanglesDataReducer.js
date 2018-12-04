import {combineActions, handleActions} from "redux-actions";
import {rectanglesData} from "../defaultRectanglesData";
import {roomHandleActions} from "./roomReducer";
import {CHANGE_3D_MODEL, CHANGE_EXECUTE, TRANSFORM_ROOM, TRANSFORMING} from "../constants";

export const rectanglesDataHandleActions = handleActions({

  [combineActions(
    CHANGE_EXECUTE,
    TRANSFORMING
  )]: (state, action) => ({
    ...state,
    [action.rectangleId]: action.newData,
  }),

  [combineActions(
    CHANGE_3D_MODEL,
    TRANSFORM_ROOM
  )]: (state, action) => ({
    ...state,
    room: roomHandleActions(state.room, action),
  }),

},rectanglesData)