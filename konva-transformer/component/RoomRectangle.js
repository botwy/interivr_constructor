import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Group} from 'react-konva';
import Rectangle from './Rectangle';
import LabelForDistance from './LabelForDistance';

class RoomRectangle extends Component {
  render() {
    const {roomData: {
      x:roomX, y:roomY, width:roomWidth, height:roomHeight,
    }} = this.props;
    return (
      <Group>
        <Rectangle
          rectangleId={"room"}
        />
        <LabelForDistance
          x={roomX+roomWidth/2+5}
          y={roomY-30}
          direction={"down"}
          labelGroup={"topForRoom"}
          field={"firstValue"}
        />
        <LabelForDistance
          x={roomX}
          y={roomY+roomHeight+30}
          direction={"up"}
          labelGroup={"bottom"}
          field={"firstValue"}
        />
        <LabelForDistance
          x={roomX+roomWidth}
          y={roomY+roomHeight+30}
          direction={"up"}
          labelGroup={"bottom"}
          field={"secondValue"}
        />
        <LabelForDistance
          x={roomX}
          y={roomY-30}
          direction={"down"}
          labelGroup={"top"}
          field={"firstValue"}
        />
        <LabelForDistance
          x={roomX+roomWidth}
          y={roomY-30}
          direction={"down"}
          labelGroup={"top"}
          field={"secondValue"}
        />

        <LabelForDistance
          x={roomX-30}
          y={roomY}
          direction={"right"}
          labelGroup={"left"}
          field={"firstValue"}
        />
        <LabelForDistance
          x={roomX-30}
          y={roomY+roomHeight}
          direction={"right"}
          labelGroup={"left"}
          field={"secondValue"}
        />

        <LabelForDistance
          x={roomX+roomWidth+30}
          y={roomY}
          direction={"left"}
          labelGroup={"right"}
          field={"firstValue"}
        />
        <LabelForDistance
          x={roomX+roomWidth+30}
          y={roomY+roomHeight}
          direction={"left"}
          labelGroup={"right"}
          field={"secondValue"}
        />
      </Group>
    );
  }
}

export default connect(
  (store) => ({
    roomData: store.rectanglesData.room,
  }),
)(RoomRectangle)