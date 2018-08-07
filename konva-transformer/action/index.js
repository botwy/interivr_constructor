import {
  CHANGE_EXECUTE,
  TRANSFORMING,
  SELECT_SHAPE,
} from "../constants";

export const rectangleChangeActionCreator = (newData, rectangleId) => ({
    type: CHANGE_EXECUTE,
    newData,
    rectangleId,
  }
)

export const transformingActionCreator = (newData, rectangleId) => ({
    type: TRANSFORMING,
    newData,
    rectangleId,
  }
)

export const selectShapeActionCreator = (shapeName) => ({
    type: SELECT_SHAPE,
    shapeName,
  }
)