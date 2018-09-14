import {rectanglesData} from "../defaultRectanglesData";
import {
  CHANGE_EXECUTE,
  SELECT_SHAPE,
  SHOW_SHAPE_LABEL,
  HIDE_SHAPE_LABEL,
  TRANSFORMING,
  CHANGE_ROOM_Z,
} from "../constants";

const defaultState = {
  rectanglesData,
  prevRectanglesData: rectanglesData || {},
  selectedShapeName: '',
  label: {},
  roomZ: 2750,
}

const reducer = (state = defaultState, action) => {
  switch (action.type) {

    case CHANGE_EXECUTE:
      return {
        ...state,
        rectanglesData: {
          ...state.rectanglesData,
          [action.rectangleId]: action.newData,
        },
        prevRectanglesData: {
          ...state.prevRectanglesData,
          [action.rectangleId]: action.newData,
        }
      }

    case  TRANSFORMING:
      if (action.rectangleId === "room") {
        return {
          ...state,
          rectanglesData: {
            ...state.rectanglesData,
            [action.rectangleId]: action.newData,
          },
          label: {
            topForRoom: {
              ...state.label.topForRoom,
              firstValue: ((state.rectanglesData.room||{}).width||0).toFixed(0),
            },
          },
        }
      }
      return {
        ...state,
        rectanglesData: {
          ...state.rectanglesData,
          [action.rectangleId]: action.newData,
        },
      }
    case  SHOW_SHAPE_LABEL:
      return {
        ...state,
        label: {
          ...state.label,
          [action.labelGroup]: {
            ...state.label[action.labelGroup],
            isLabelVisible: true,
            firstValue: action.firstValue,
            secondValue: action.secondValue,
          },
        },
      }
    case  HIDE_SHAPE_LABEL:
      return {
        ...state,
        label: {},
      }

    case  SELECT_SHAPE:
      if (state.selectedShapeName === action.shapeName) {
        return state;
      }
      if (action.shapeName === "room") {
        return {
          ...state,
          selectedShapeName: action.shapeName,
          label: {
            topForRoom: {
              isLabelVisible: true,
              firstValue: ((state.rectanglesData.room||{}).width||0).toFixed(0),
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

    case CHANGE_ROOM_Z:
      return {
        ...state,
        roomZ: action.z,
      }

    default:
      return state;
  }
}

export default reducer;