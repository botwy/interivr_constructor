import {handleActions} from "redux-actions";
import {CHANGE_3D_MODEL, TRANSFORM_ROOM} from "../constants";

export const roomHandleActions = handleActions({
  [CHANGE_3D_MODEL]: (state, action) => ({
    ...state,
    model3d: action.model3d,
  }),
  [TRANSFORM_ROOM]: (state, action) => ({
    ...state,
    model3dLocalPosition: {
      ...state.model3dLocalPosition,
      ...action.new3dModel,
    },
  }),
}, {} )