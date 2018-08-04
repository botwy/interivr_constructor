import React, {Component} from 'react';
import {Layer, Rect, Stage, Group, Line, Circle, Transformer} from 'react-konva';

export class Rectangle extends Component {
    handleDragging = e => {
        const shape = e.target;
        // take a look into width and height properties
        // by default Transformer will change scaleX and scaleY
        // while transforming
        // so we need to adjust that properties to width and height
        this.props.onDragEnd({
            x: shape.x(),
            y: shape.y(),
        });
    };

    handleTransforming = e => {
      const shape = e.target;
      this.props.onTransform({
        x: shape.x(),
        y: shape.y(),
        width: shape.width() * shape.scaleX(),
        height: shape.height() * shape.scaleY(),
        rotation: shape.rotation()
      });
    }

    render() {
        return (
            <Rect
                x={this.props.x}
                y={this.props.y}
                width={this.props.width}
                height={this.props.height}
                // force no scaling
                // otherwise Transformer will change it
                scaleX={1}
                scaleY={1}
                fill={this.props.fill}
                stroke={this.props.strokeColor}
                strokeWidth={this.props.strokeWidth}
                name={this.props.name}
                // save state on dragend or transformend
                onDragEnd={this.handleDragging}
                onTransformEnd={this.handleChange}
                onTransform={this.handleTransforming}
                draggable
            />
        );
    }
}