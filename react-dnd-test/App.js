import React, {Component} from 'react';
import {DragDropContext,DragSource} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend'

class App extends Component {
    componentDidMount() {
        this.draw();
    }
   draw() {
       const canvas = this.canvas;
       if (canvas.getContext) {
           const ctx = canvas.getContext('2d');

           ctx.fillRect(25,25,100,100);
           ctx.clearRect(45,45,60,60);
           ctx.strokeRect(50,50,50,50);
       }
   }
    render() {
        const { isDragging, connectDragSource, text } = this.props;

                return connectDragSource(
               <div>
                  <canvas ref = {canvas => {this.canvas = canvas;}}>

                  </canvas>
              </div>

              )

        // connectDragSource(
       //    return <div>
        //        Hello world
      //          {text}
      //      </div>
     //       )

   }
}


export default DragDropContext(HTML5Backend)(DragSource(
    "card",
    {
        beginDrag(props) {
            return {
                text: "begin",
            };
        },
        endDrag(props) {
            return {
                text: "end",
            };
        }
    },
    (connect, monitor) => {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}
)(App));