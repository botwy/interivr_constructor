import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Rect} from 'react-konva';
import {attractRotation} from "../utils/geometry2dUtils";
import {
  transformingActionCreator,
  updateLabelByNewData,
  updateRectangleByNewData,
  rectangleTransformEnd,
} from "../action";

class Rectangle extends Component {

  getShapeDataByScale = (shape) => {
    const {rectangleId, rectangleData: {model3d} = {}, roomZ} = this.props;
    console.log(shape)
    const x = shape.x();
    const y = shape.y();
    const width = shape.width() * shape.scaleX();
    const height = shape.height() * shape.scaleY();
    const rotation = shape.rotation();

    let newModel3d;
    if (rectangleId === "room") {
      // newModel3d = getRoom3dModel({x, y, width, height, model3d}, roomZ);
    }

    return ({x, y, width, height, rotation, model3d: newModel3d});
  }

  handleRectDragMove = (e) => {
    const shape = e.target;
    const {rectangleId, rectangleData = {}} = this.props;
    if (rectangleId === "room") {
      return;
    }
    const changedData = {x: shape.x(), y: shape.y()}
    this.props.updateDistanceLabel(rectangleData, changedData);
  };

  handleRectDragEnd = (e) => {
    const shape = e.target;
    const {
      rectangleData = {},
    } = this.props;
    const changedData = {x: shape.x(), y: shape.y()}

    this.props.changeRectangleDataExecute(rectangleData, changedData);
  };

  handleRectTransforming = (e) => {
    const {rectangleData = {}, rectangleId} = this.props;
    const shape = e.target;
    const changedData = this.getShapeDataByScale(shape);

    this.props.transformingRectangle({...rectangleData, ...changedData});
  };

  handleRectTransformEnd = (e) => {
    const {
      rectangleData = {},
      prevRectangleData = {},
      changeRectangleDataExecute,
      rectangleTransformEnd,
    } = this.props;
    const shape = e.target;
    const changedData = this.getShapeDataByScale(shape);

    const changingRotation = attractRotation(
      {...rectangleData, ...changedData},
      prevRectangleData
    );
    if (!changingRotation) {
      rectangleTransformEnd();
      return;
    }

    changeRectangleDataExecute({...rectangleData, ...changedData, ...changingRotation});
    rectangleTransformEnd();
  };

  render() {
    const {rectangleData: {x, y, width, height, rotation, fill, strokeColor, strokeWidth, name} = {}} = this.props;

    return (
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        rotation={rotation}
        // force no scaling
        // otherwise Transformer will change it
        scaleX={1}
        scaleY={1}
        fill={fill}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        name={name}
        // save state on dragend or transformend
        onDragEnd={this.handleRectDragEnd}
        onTransformEnd={this.handleRectTransformEnd}
        onTransform={this.handleRectTransforming}
        onDragMove={this.handleRectDragMove}
        draggable
      />
    );
  }
}

export default connect(
  (store, {rectangleId}) => ({
    rectangleData: store.rectanglesData[rectangleId],
    prevRectangleData: store.prevRectanglesData[rectangleId],
    roomZ: store.roomZ,
  }),
  (dispatch, {rectangleId}) => ({
    rectangleTransformEnd: () => dispatch(rectangleTransformEnd(rectangleId)),
    changeRectangleDataExecute: (rectangleData, changedData) =>
      dispatch(updateRectangleByNewData(rectangleData, changedData, rectangleId)),
    transformingRectangle: (newData) => dispatch(transformingActionCreator(newData, rectangleId)),
    updateDistanceLabel: (rectangleData, changedData) => dispatch(updateLabelByNewData(rectangleData, changedData)),
  })
)(Rectangle)