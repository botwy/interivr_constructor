import {shapeType} from "./constants/shapeType";

export const rectanglesData = {
room: {
  x: 200,
  y: 80,
  width: 300,
  height: 300,
  strokeColor: "blue",
  strokeWidth: 20,
  name: 'room',
  type: shapeType.ROOM,
},
window1: {
  x: 10,
  y: 50,
  width: 150,
  height: 20,
  fill: 'green',
  name: 'window1',
  type: shapeType.WINDOW,
},
window2: {
  x: 10,
    y: 100,
  width: 150,
  height: 20,
  fill: 'green',
  name: 'window2',
  type: shapeType.WINDOW,
},
door1: {
  x: 10,
  y: 150,
  width: 90,
  height: 20,
  fill: 'red',
  name: 'door1',
  type: shapeType.DOOR,
}
};