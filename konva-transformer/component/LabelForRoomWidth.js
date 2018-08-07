import React from 'react';
import {Label, Text, Tag} from 'react-konva';
import {connect} from 'react-redux';

const LabelForRoomWidth = ({isVisible, roomWidth}) => (
  <Label
    x={350}
    y={50}
    width={150}
    height={50}
    visible={isVisible}
  >
    <Tag
      width={150}
      height={50}
      fill={'yellow'}
      pointerDirection={'down'}
      pointerWidth={10}
      pointerHeight={10}
      lineJoin={'round'}
      shadowColor={'yellow'}
      shadowBlur={10}
      shadowOffset={10}
      shadowOpacity={0.5}
    />
    <Text
      text={(roomWidth || 0).toFixed(0)}
    />
  </Label>
)

export default connect(
  store => ({
    isVisible: store.isLabelVisible,
    roomWidth: (store.rectanglesData.room||{}).width,
  })
)(LabelForRoomWidth)