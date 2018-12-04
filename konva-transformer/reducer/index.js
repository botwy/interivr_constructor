import {handleActions, combineActions} from "redux-actions";
import {rectanglesData} from "../defaultRectanglesData";
import {
  CHANGE_EXECUTE,
  SELECT_SHAPE,
  SHOW_SHAPE_LABEL,
  HIDE_SHAPE_LABEL,
  TRANSFORMING,
  CHANGE_ROOM_Z,
  CHANGE_3D_MODEL,
  TRANSFORM_ROOM,
} from "../constants";
import {SHAPE_TYPE} from "../constants/shapeType";
import {roomZ} from "../constants/defaultRoom3dModel";
import {rectanglesDataHandleActions} from "./rectanglesDataReducer";
import {prevRectanglesDataHandleActions} from "./prevRectanglesDataReducer";
import {labelHandleActions} from "./labelReducer";
import get from "lodash/get";

export const defaultState = {
  rectanglesData,
  prevRectanglesData: rectanglesData || {},
  selectedShapeName: '',
  label: {},
  roomZ: roomZ*100,
}
const reducer = handleActions({

  [CHANGE_EXECUTE]: (state, action) => ({
    ...state,
    rectanglesData: rectanglesDataHandleActions(state.rectanglesData, action),
    prevRectanglesData: prevRectanglesDataHandleActions(state.prevRectanglesData, action),
  }),

  [combineActions(
    CHANGE_3D_MODEL,
    TRANSFORM_ROOM
  )]: (state, action) => ({
    ...state,
    rectanglesData: rectanglesDataHandleActions(state.rectanglesData, action),
  }),

  [TRANSFORMING]: (state, action) => {
    if (action.rectangleId === SHAPE_TYPE) {
      const firstValue = get(state, `rectanglesData.room.width`,0);

      return {
        ...state,
        rectanglesData: rectanglesDataHandleActions(state.rectanglesData, action),
        label: {
          topForRoom: {
            ...state.label.topForRoom,
            firstValue: Number(firstValue).toFixed(0),
          },
        },
      }
    }

    return {
      ...state,
      rectanglesData: rectanglesDataHandleActions(state.rectanglesData, action),
    }
  },

  [combineActions(
    SHOW_SHAPE_LABEL,
    HIDE_SHAPE_LABEL
  )]: (state, action) => ({
    ...state,
    label: labelHandleActions(state.label, action),
  }),

  [SELECT_SHAPE]: (state, action) => {
    if (state.selectedShapeName === action.shapeName) {
      return state;
    }
    if (action.shapeName === SHAPE_TYPE.ROOM) {
      const firstValue = get(state, `rectanglesData.room.width`,0);

      return {
        ...state,
        selectedShapeName: action.shapeName,
        label: {
          topForRoom: {
            isLabelVisible: true,
            firstValue: Number(firstValue).toFixed(0),
          },
        },
      }
    } else {
      return {
        ...state,
        selectedShapeName: action.shapeName,
        label: {},
      }
    }

  },
  [CHANGE_ROOM_Z]: (state, action) => ({
    ...state,
    roomZ: action.z,
  }),

}, defaultState)

export default reducer;