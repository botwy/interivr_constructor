import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Rect} from 'react-konva';
import {attractRotation, attractToTargetShape} from "../utils/geometry2dUtils";
import {rectangleChangeActionCreator, transformingActionCreator} from "../action";

class Rectangle extends Component {

  getShapeDataByScale = (shape) => ({
      x: shape.x(),
      y: shape.y(),
      width: shape.width() * shape.scaleX(),
      height: shape.height() * shape.scaleY(),
      rotation: shape.rotation()
    })

  handleRectDragEnd = (e) => {
    const shape = e.target;
    const {
      changeRectangleDataExecute,
      rectangleId,
      rectangleData = {},
      roomData = {},
    } = this.props;
    const changedData = {x: shape.x(), y: shape.y()}

    let changingProps = {}
    if (rectangleId !== "room") {
      changingProps = attractToTargetShape({...rectangleData, ...changedData}, roomData);
    }
    const newData = {...rectangleData, ...changedData, ...changingProps};
    changeRectangleDataExecute(newData);
  };

  handleRectTransformChange = (e) => {
    const {rectangleData = {}, prevRectangleData = {}, changeRectangleDataExecute} = this.props;
    const shape = e.target;
    const changedData = this.getShapeDataByScale(shape);

    const changingRotation = attractRotation(
      {...rectangleData, ...changedData},
      prevRectangleData
    );
    if (!changingRotation) {
      return;
    }

    changeRectangleDataExecute({...rectangleData, ...changedData, ...changingRotation});
  };

  handleRectTransforming = (e) => {
    const {rectangleData = {}, transformingRectangle} = this.props;
    const shape = e.target;
    const changedData = this.getShapeDataByScale(shape);

    transformingRectangle({...rectangleData, ...changedData});
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
        onTransformEnd={this.handleRectTransformChange}
        onTransform={this.handleRectTransforming}
        draggable
      />
    );
  }
}

export default connect(
  (store, {rectangleId}) => ({
    rectangleData: store.rectanglesData[rectangleId],
    prevRectangleData: store.prevRectanglesData[rectangleId],
    roomData: store.rectanglesData.room,
  }),
  (dispatch, {rectangleId}) => ({
    changeRectangleDataExecute: (newData) => dispatch(rectangleChangeActionCreator(newData, rectangleId)),
    transformingRectangle: (newData) => dispatch(transformingActionCreator(newData, rectangleId)),
  })
)(Rectangle)