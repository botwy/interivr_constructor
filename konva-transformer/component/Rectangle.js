import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Rect} from 'react-konva';
import {attractRotation, attractToTargetShape, distanceFromTargetCorner} from "../utils/geometry2dUtils";
import {rectangleChangeActionCreator, transformingActionCreator} from "../action";
import {
  HIDE_SHAPE_LABEL,
  SHOW_SHAPE_LABEL,
} from "../constants";

class Rectangle extends Component {

  getShapeDataByScale = (shape) => ({
    x: shape.x(),
    y: shape.y(),
    width: shape.width() * shape.scaleX(),
    height: shape.height() * shape.scaleY(),
    rotation: shape.rotation()
  })

  showDistanceToCorner = (newData, roomData, changingProps) => {
    if (changingProps && Object.keys(changingProps).length > 0) {
      const distanceData = distanceFromTargetCorner(newData, roomData)||{};
      this.props.showShapeLabel(distanceData);
    }else{
      this.props.hideShapeLabel();
    }
  }

  handleRectDragMove = (e) => {
    const shape = e.target;
    const {rectangleId, rectangleData = {}, roomData = {}} = this.props;
    if (rectangleId === "room") {
      return;
    }
    const changedData = {x: shape.x(), y: shape.y()}
    const changingProps = attractToTargetShape({...rectangleData, ...changedData}, roomData);
    const newData = {...rectangleData, ...changedData, ...changingProps};
    this.showDistanceToCorner(newData, roomData, changingProps);
  };

  handleRectDragEnd = (e) => {
    const shape = e.target;
    const {
      changeRectangleDataExecute,
      rectangleId,
      rectangleData = {},
      roomData = {},
    } = this.props;
    const changedData = {x: shape.x(), y: shape.y()}

    if (rectangleId === "room") {
      changeRectangleDataExecute({...rectangleData, ...changedData});
      return;
    }
    let changingProps = attractToTargetShape({...rectangleData, ...changedData}, roomData);
    const newData = {...rectangleData, ...changedData, ...changingProps};
    changeRectangleDataExecute(newData);
    this.showDistanceToCorner(newData, roomData, changingProps);
  };

  handleRectTransforming = (e) => {
    const {rectangleData = {}, transformingRectangle} = this.props;
    const shape = e.target;
    const changedData = this.getShapeDataByScale(shape);

    transformingRectangle({...rectangleData, ...changedData});
  };

  handleRectTransformEnd = (e) => {
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
    roomData: store.rectanglesData.room,
  }),
  (dispatch, {rectangleId}) => ({
    changeRectangleDataExecute: (newData) => dispatch(rectangleChangeActionCreator(newData, rectangleId)),
    transformingRectangle: (newData) => dispatch(transformingActionCreator(newData, rectangleId)),
    showShapeLabel: ({leftDistance, rightDistance, locationForLabel}) =>
      dispatch({
        type: SHOW_SHAPE_LABEL,
        firstValue: leftDistance,
        secondValue: rightDistance,
        labelGroup: locationForLabel,
      }),
    hideShapeLabel: () => dispatch({type: HIDE_SHAPE_LABEL}),
  })
)(Rectangle)