import {SHAPE_TYPE} from "./constants/shapeType";
import {defaultRoom3dModel} from "./constants/defaultRoom3dModel";
import {defaultLocalPosition, initRoomHeight, initRoomWidth} from "./constants/defaultLocalPositionsForVertices";

export const rectanglesData = {
  room: {
    x: 200,
    y: 80,
    width: initRoomWidth,
    height: initRoomHeight,
    strokeColor: "blue",
    strokeWidth: 20,
    name: 'room',
    type: SHAPE_TYPE.ROOM,
    model3d: defaultRoom3dModel,
    model3dLocalPosition: defaultLocalPosition,
    model3dInitData: defaultLocalPosition,
  },
  window1: {
    x: 10,
    y: 50,
    width: 150,
    height: 20,
    fill: 'green',
    name: 'window1',
    type: SHAPE_TYPE.WINDOW,
  },
  window2: {
    x: 10,
    y: 100,
    width: 150,
    height: 20,
    fill: 'green',
    name: 'window2',
    type: SHAPE_TYPE.WINDOW,
  },
  door1: {
    x: 10,
    y: 150,
    width: 90,
    height: 20,
    fill: 'red',
    name: 'door1',
    type: SHAPE_TYPE.DOOR,
  }
};