import {rectanglesData} from "../defaultRectanglesData";
import {
  CHANGE_EXECUTE,
  SELECT_SHAPE,
  TRANSFORMING,
} from "../constants";

const defaultState = {
  rectanglesData,
  prevRectanglesData: rectanglesData || {},
  selectedShapeName: '',
  isLabelVisible: false,
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
      return {
        ...state,
        rectanglesData: {
          ...state.rectanglesData,
          [action.rectangleId]: action.newData,
        },
      }

    case  SELECT_SHAPE:
      if (action.shapeName === "room") {
        return {
          ...state,
          selectedShapeName: action.shapeName,
          isLabelVisible: true,
        }
      } else {
        return {
          ...state,
          selectedShapeName: action.shapeName,
          isLabelVisible: false,
        }
      }

    default:
      return state;
  }
}

export default reducer;