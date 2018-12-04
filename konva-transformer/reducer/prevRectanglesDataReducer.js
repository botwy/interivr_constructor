import {handleActions} from "redux-actions";
import {rectanglesData} from "../defaultRectanglesData";
import {CHANGE_EXECUTE} from "../constants";

export const prevRectanglesDataHandleActions = handleActions({
  [CHANGE_EXECUTE]: (state, action) => ({
    ...state,
    [action.rectangleId]: action.newData,
  })
},rectanglesData)