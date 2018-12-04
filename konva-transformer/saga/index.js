import {takeEvery, effects} from "redux-saga";
import axios from "axios";

const {put, call} = effects;

export function* watchUpdateModel() {
  yield takeEvery("UPDATE_MODEL", updateModelAsync)
}

function* updateModelAsync() {
  try {
    const response = yield call(() => {
      return axios.get("http://13.rsumka.z8.ru/ivr/create_room.php", {params: {body: {}}})
    })
    yield put({type: "CREATE_ROOM_SUCCESS", response})
  }catch (err) {
    yield put({type: "CREATE_ROOM_ERROR", err})
  }
}