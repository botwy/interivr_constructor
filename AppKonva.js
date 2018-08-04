import React, {Component} from 'react';
import { render } from 'react-dom';
import {Layer, Rect, Stage, Group, Line, Circle} from 'react-konva';
import {Rectangle} from './Rectangle';

class AppKonva extends Component {

    constructor(){
        super();
        this.state = {
            rectangles: [
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100,
                    fill: 'red',
                    name: 'rect1'
                },
                {
                    x: 150,
                    y: 150,
                    width: 100,
                    height: 100,
                    fill: 'green',
                    name: 'rect2'
                }
            ],
            selectedShapeName: ''
        };
    }

    handleStageMouseDown(e) {
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
                selectedShapeName: name
            });
        } else {
            this.setState({
                selectedShapeName: ''
            });
        }
    };
    handleRectChange (index, newProps) {
        const rectangles = this.state.rectangles.concat();
        rectangles[index] = {
            ...rectangles[index],
            ...newProps
        };

        this.setState({ rectangles });
    };
    render() {
        return (
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                onMouseDown={this.handleStageMouseDown}
            >
                <Layer>
                    {this.state.rectangles.map((rect, i) => (
                        <Rectangle
                            key={i}
                            {...rect}
                            onTransform={newProps => {
                                this.handleRectChange(i, newProps);
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

export  default AppKonva;