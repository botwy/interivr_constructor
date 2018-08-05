import {rectangleList} from "../initialState";

const defaultState = {
  rectangles: rectangleList,
  prevRectangles: rectangleList,
  selectedShapeName: '',
  isLabelVisible: false,
  roomWidth: rectangleList[0].width,
  roomRectangle: rectangleList[0],
}

const reducer = (state = defaultState, action) => {
  return state;
}

export default reducer;