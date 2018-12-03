import {
  CHANGE_EXECUTE,
  TRANSFORMING,
  SELECT_SHAPE,
  SHOW_SHAPE_LABEL,
  HIDE_SHAPE_LABEL,
  CHANGE_ROOM_Z,
  CHANGE_3D_MODEL,
  TRANSFORMING_END,
  TRANSFORM_ROOM,
} from "../constants";
import axios from "axios";
import {createCubeInObjFormat, get3dModelInObjFormat} from "../utils/create3dModelUtils";
import {getRoom3dModelAfterAttractShape, scaleVerticesMatrixForX, scaleVerticesMatrixForY} from "../utils/geometry3dUtils";
import {initRoomWidth, initRoomHeight} from "../constants/defaultLocalPositionsForVertices";
import {attractRotation, attractToTargetShape, distanceFromTargetCorner} from "../utils/geometry2dUtils";
import {SHAPE_TYPE} from "../constants/shapeType";

const rectangleChangeActionCreator = (newData, rectangleId) => ({
    type: CHANGE_EXECUTE,
    newData,
    rectangleId,
  }
)

const change3dModelAfterAttractShape = (shapeData) => (dispatch, getState) => {
  const prevModel3d = getState().rectanglesData.room.model3d;
  const roomData = getState().rectanglesData.room;
  const roomZ = getState().roomZ;
  const newModel3d = getRoom3dModelAfterAttractShape(shapeData, roomZ, roomData);
console.log(shapeData)
console.log(prevModel3d)
  dispatch ({
      type: CHANGE_3D_MODEL,
      model3d: newModel3d,
    });
}

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

  dispatch(rectangleChangeActionCreator(newData, rectangleId));

  if (typeof changingProps === "object" && Object.keys(changingProps).length) {
    dispatch(change3dModelAfterAttractShape(newData));
  }
}

export const createRoom = () => (dispatch, getState) => {
  const roomData = (getState().rectanglesData||{}).room || {};
  const { model3d } = roomData;
  const totalObj3dList = [];
  Object.keys(model3d).forEach(key => {
    const {f, uv, vn} = model3d[key] || {};

    totalObj3dList.push({object3dFaceList: f, normal: vn, uv: uv})
  })
  const scaleObj = { scaleX: 1, scaleY: 1, scaleZ: 1 };
  const obj3D = get3dModelInObjFormat(totalObj3dList, scaleObj);


  const requestBody = JSON.stringify(obj3D);
  dispatch({type: "CREATE_ROOM_REQUEST"});

  axios.get("http://13.rsumka.z8.ru/ivr/create_room.php", {params: {body: requestBody}})
    .then((responce) => dispatch({type: "CREATE_ROOM_SUCCESS", responce}))
    .catch((err) => dispatch({type: "CREATE_ROOM_ERROR", err}))

}

const transformRooms3dObjects = () => (dispatch, getState) => {
  const {width, height} = getState().rectanglesData.room || {};
  const diffX = width - initRoomWidth;
  const diffY = height - initRoomHeight;
  if (diffX > 0) {
    const  prevFloor = getState().rectanglesData.room.model3dLocalPosition.floor;
    const newFloor = {
      ...prevFloor,
      f: scaleVerticesMatrixForX(prevFloor.f[0], width/initRoomWidth),
    };
    const new3dModel = {floor: newFloor};
    dispatch({type: TRANSFORM_ROOM, new3dModel});
    return;
  }
  if (diffY > 0) {

  }
  dispatch({type: TRANSFORM_ROOM, diffX, diffY})
}


export const rectangleTransformEnd = (rectangleId) => (dispatch) => {
  if (rectangleId === SHAPE_TYPE.ROOM) {
    dispatch(transformRooms3dObjects());
  }
  dispatch({
    type: TRANSFORMING_END,
  })
}