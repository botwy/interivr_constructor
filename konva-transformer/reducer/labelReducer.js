import {handleActions} from "redux-actions";
import {
  HIDE_SHAPE_LABEL,
  SHOW_SHAPE_LABEL,
} from "../constants";

export const labelHandleActions = handleActions({

  [SHOW_SHAPE_LABEL]: (state, action) => ({
    ...state,
    [action.labelGroup]: {
      ...state.label[action.labelGroup],
      isLabelVisible: true,
      firstValue: action.firstValue,
      secondValue: action.secondValue,
    },

  }),
  [HIDE_SHAPE_LABEL]: () => ( {} ),

}, {} )