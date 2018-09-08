import {
  CHANGE_EXECUTE,
  TRANSFORMING,
  SELECT_SHAPE,
  SHOW_SHAPE_LABEL,
  HIDE_SHAPE_LABEL,
} from "../constants";
import axios from "axios";

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

export const createRoom = () => (dispatch, getState) => {
  const roomData = (getState().rectanglesData||{}).room;

  const cubeVertices = [
    [1,1,0],
    [1,-1,0],
    [-1,-1,0],
    [-1,1,0],
    [1,1,2],
    [1,-1,2],
    [-1,-1,2],
    [-1,1,2],
  ];
  const cubeFacesAndNormals = [
    {f:[1,2,3,4],vn:[0,0,-1]},
    {f:[5,8,7,6],vn:[0,0,1]},
    {f:[1,5,6,2],vn:[1,0,0]},
    {f:[2,6,7,3],vn:[0,-1,0]},
    {f:[3,7,8,4],vn:[-1,0,0]},
    {f:[5,1,4,8],vn:[0,1,0]},
  ];
  const z = 300;
  const height = roomData.height;
  const width = roomData.width;

  const obj3D = [];
  obj3D.push("mtllib cube3x3.mtl");
  obj3D.push("o Cube");

  cubeVertices.forEach((vertice, index) => {
    const scaleVertice = vertice.map((dimension, index) => {
      if (index === 0) {
        return dimension*width/200;
      }
      if (index === 1) {
        return dimension*height/200;
      }
      if (index === 2) {
        return dimension*z/200;
      }
    });
    const newVerticeObjStr = ["v",...scaleVertice].join(" ").trim();
    obj3D.push(newVerticeObjStr);
  })

  cubeFacesAndNormals.forEach(faceAndNormalObj => {
    obj3D.push(["vn", ...faceAndNormalObj.vn].join(" ").trim());
  })

  obj3D.push("usemtl Material");
  obj3D.push("s off");

  cubeFacesAndNormals.forEach((faceAndNormalObj,faceIndex) => {
    obj3D.push([
      "f",
      ...faceAndNormalObj.f.map((f) => f + "//" + (faceIndex+1))
    ].join(" ").trim());
  })

  const requestBody = JSON.stringify(obj3D);
  dispatch({type: "CREATE_ROOM_REQUEST"});

  axios.get("http://13.rsumka.z8.ru/ivr/create_room.php", {params: {body: requestBody}})
    .then((responce) => dispatch({type: "CREATE_ROOM_SUCCESS", responce}))
    .catch((err) => dispatch({type: "CREATE_ROOM_ERROR", err}))

}