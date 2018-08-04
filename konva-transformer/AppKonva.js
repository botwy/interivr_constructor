import React, {Component} from 'react';
import {render} from 'react-dom';
import {Layer, Rect, Stage, Group, Line, Circle, Label, Text, Tag} from 'react-konva';
import {Rectangle} from './Rectangle';
import {TransformerComponent} from './TransformerComponent';
import {rectangleList} from './initialState';

class AppKonva extends Component {

  state = {
    rectangles: rectangleList,
    selectedShapeName: '',
    isLabelVisible: false,
    roomWidth: rectangleList[0].width,
  };



  handleStageMouseDown = (e) => {
    // clicked on stage - cler selection
    if (e.target === e.target.getStage()) {
      this.setState({
        selectedShapeName: ''
      });
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
    const rect = this.state.rectangles.find(r => r.name === name);
    if (rect) {
      this.setState({
        selectedShapeName: name,
        isLabelVisible: name === "room",
      });
    } else {
      this.setState({
        selectedShapeName: '',
        isLabelVisible: false,
      });
    }
  };

  handleRectDragging = (index, newProps) => {
    const rectangles = this.state.rectangles.concat();
    rectangles[index] = {
      ...rectangles[index],
      ...newProps
    };
    this.setState({rectangles});
  };

  handleRectTransforming = (index, newProps) => {
    const rectangles = this.state.rectangles.concat();
    rectangles[index] = {
      ...rectangles[index],
      ...newProps
    };
    if (this.state.selectedShapeName === 'room') {
      this.setState({rectangles, roomWidth: newProps.width});
      return;
    }
    this.setState({rectangles});
  };

  render() {
    return (
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={this.handleStageMouseDown}
      >
        <Layer>
          <Label
            x={350}
            y={50}
            width={150}
            height={50}
            visible={this.state.isLabelVisible}
          >
            <Tag
              width={150}
              height={50}
              fill={'yellow'}
              pointerDirection = {'down'}
              pointerWidth = {10}
              pointerHeight={10}
              lineJoin={'round'}
              shadowColor={'yellow'}
              shadowBlur={10}
              shadowOffset={10}
              shadowOpacity={0.5}
            />
            <Text
              text={(this.state.roomWidth||0).toFixed(0)}
            />
          </Label>
          {this.state.rectangles.map((rect, i) => (
            <Rectangle
              key={i}
              {...rect}
              onDragEnd={newProps => {
                this.handleRectDragging(i, newProps);
              }}
              onTransform={newProps => {
                this.handleRectTransforming(i, newProps);
              }}
            />
          ))}
          <TransformerComponent
            selectedShapeName={this.state.selectedShapeName}
          />
        </Layer>
      </Stage>
    );
  }
}

export default AppKonva;