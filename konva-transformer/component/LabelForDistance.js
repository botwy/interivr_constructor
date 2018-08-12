import React from 'react';
import {Label, Text, Tag} from 'react-konva';
import {connect} from 'react-redux';

const LabelForDistance = ({x, y, direction, isVisible, value}) => (
  <Label
    x={x}
    y={y}
    visible={!!isVisible}
  >
    <Tag
      fill={'yellow'}
      pointerDirection={direction}
      pointerWidth={10}
      pointerHeight={10}
      lineJoin={'round'}
      shadowColor={'yellow'}
      shadowBlur={10}
      shadowOffset={10}
      shadowOpacity={0.5}
    />
    <Text
      text={value}
    />
  </Label>
)

export default connect(
  (store, {labelGroup, field}) => ({
    isVisible: (store.label[labelGroup]||{}).isLabelVisible,
    value: (store.label[labelGroup]||{})[field],
  })
)(LabelForDistance)