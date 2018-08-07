import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Layer, Stage} from 'react-konva';
import Rectangle from './component/Rectangle';
import TransformerComponent from './component/TransformerComponent';
import {rectangleIdList} from './rectangleIdList';
import LabelForRoomWidth from './component/LabelForRoomWidth';
import {selectShapeActionCreator} from "./action";

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
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={this.handleStageMouseDown}
      >
        <Layer>

          <LabelForRoomWidth/>

          {rectangleIdList.map((rect, i) => (
            <Rectangle
              key={i}
              rectangleId={rect.rectangleId}
            />
          ))}

          <TransformerComponent />

        </Layer>
      </Stage>
    );
  }
}

export default connect(
  undefined,
  dispatch => ({
    selectShape: (shapeName) => dispatch(selectShapeActionCreator(shapeName))
  })
)(AppKonva);