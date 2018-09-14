import {
  CHANGE_EXECUTE,
  TRANSFORMING,
  SELECT_SHAPE,
  SHOW_SHAPE_LABEL,
  HIDE_SHAPE_LABEL, CHANGE_ROOM_Z,
} from "../constants";
import axios from "axios";
import {createCubeInObjFormat} from "../utils/create3dModelUtils";

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

export const changeRoomZ = (z) => ({
  type: CHANGE_ROOM_Z,
  z,
})

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

export const createRoom = () => (dispatch, getState) => {
  const roomData = (getState().rectanglesData||{}).room;
  const rectanglesData = getState().rectanglesData;
  const roomZ = getState().roomZ;

  const z = roomZ/100;
  const height = roomData.height/100;
  const width = roomData.width/100;

  const obj3D = createCubeInObjFormat(width, height, z, rectanglesData);


  const requestBody = JSON.stringify(obj3D);
  dispatch({type: "CREATE_ROOM_REQUEST"});

  axios.get("http://13.rsumka.z8.ru/ivr/create_room.php", {params: {body: requestBody}})
    .then((responce) => dispatch({type: "CREATE_ROOM_SUCCESS", responce}))
    .catch((err) => dispatch({type: "CREATE_ROOM_ERROR", err}))

}