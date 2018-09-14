import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Layer, Stage} from 'react-konva';
import Rectangle from './component/Rectangle';
import RoomRectangle from './component/RoomRectangle';
import TransformerComponent from './component/TransformerComponent';
import {rectangleIdList} from './rectangleIdList';
import {selectShapeActionCreator, createRoom, changeRoomZ} from "./action";

class AppKonva extends Component {

  handleStageMouseDown = (e) => {
    // clicked on stage - cler selection
    if (e.target === e.target.getStage()) {
      this.props.selectShape("");
      return;
    }
    // clicked on transformer - do nothing
    const clickedOnTransformer =
      e.target.getParent().className === 'Transformer';

    if (clickedOnTransformer) {
      return;
    }

    // find clicked rect by its name
    const name = e.target.name();
    this.props.selectShape(name);
  };

  render() {
    return (
      <div>
        <div>
          <input
            value={this.props.roomZ}
            onChange={this.props.changeRoomZ}
          />
          <button onClick={this.props.createRoom}>Создать комнату</button>
        </div>
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={this.handleStageMouseDown}
        >
          <Layer>

            <RoomRectangle/>

            {rectangleIdList.map((rect, i) => (
              <Rectangle
                key={i}
                rectangleId={rect.rectangleId}
              />
            ))
            }

            <TransformerComponent/>

          </Layer>
        </Stage>
      </div>
    );
  }
}

export default connect(
  store => ({
    selectedShapeName: store.selectedShapeName,
    roomZ: store.roomZ,
  }),
  dispatch => ({
    selectShape: (shapeName) => dispatch(selectShapeActionCreator(shapeName)),
    createRoom: () => dispatch(createRoom()),
    changeRoomZ: (e) => dispatch(changeRoomZ(e.target.value)),
  })
)(AppKonva);