import {
  CHANGE_EXECUTE,
  TRANSFORMING,
  SELECT_SHAPE,
  SHOW_SHAPE_LABEL,
  HIDE_SHAPE_LABEL,
} from "../constants";
import {attractRotation, attractToTargetShape, distanceFromTargetCorner} from "../utils/geometry2dUtils";

const rectangleChangeActionCreator = (newData, rectangleId) => ({
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

export const updateLabelByNewData = (rectangleData, changedData) => (dispatch, getState) => {
  const roomData = (getState().rectanglesData||{}).room;
  const changingProps = attractToTargetShape({...rectangleData, ...changedData}, roomData);
  if (changingProps && Object.keys(changingProps).length > 0) {
    const newData = {...rectangleData, ...changedData, ...changingProps};
    const {leftDistance, rightDistance, locationForLabel} = distanceFromTargetCorner(newData, roomData)||{};
    dispatch({
      type: SHOW_SHAPE_LABEL,
      firstValue: leftDistance,
      secondValue: rightDistance,
      labelGroup: locationForLabel,
    });
  }else{
    dispatch({type: HIDE_SHAPE_LABEL});
  }
}

export const updateRectangleByNewData = (rectangleData, changedData, rectangleId) => (dispatch, getState) => {
  const roomData = (getState().rectanglesData||{}).room;
  if (rectangleId === "room") {
    dispatch(rectangleChangeActionCreator({...rectangleData, ...changedData}, rectangleId))
    return;
  }
  let changingProps = attractToTargetShape({...rectangleData, ...changedData}, roomData);
  const newData = {...rectangleData, ...changedData, ...changingProps};
  dispatch(rectangleChangeActionCreator(newData, rectangleId))
}