export const attractToTargetShape = (currentShapeData = {}, targetShapeData = {}) => {
  const {x, y, rotation = 0} = currentShapeData;
  const {x: targetX, y: targetY, width: targetWidth, height: targetHeight, strokeWidth} = targetShapeData;

  const realTargetY = targetY - strokeWidth / 2;
  const realTargetX = targetX + strokeWidth / 2;

  if (Math.abs(y - realTargetY) < 20 && rotation === 0) {
    return {y: realTargetY};
  }
  if (Math.abs(y - (realTargetY + targetHeight)) < 20 && rotation === 0) {
    return {y: realTargetY + targetHeight};
  }
  if (Math.abs(x - realTargetX) < 20 && rotation === 90) {
    return {x: realTargetX};
  }
  if (Math.abs(x - (realTargetX + targetWidth)) < 20 && rotation === 90) {
    return {x: realTargetX + targetWidth};
  }
  return {};
}

export const attractRotation = (currentShapeData = {}, previousData) => {
  if (!previousData) {
    return;
  }
  const {rotation, width, height} = currentShapeData;
  const {x: prevX, y: prevY, rotation: prevRotation = 0} = previousData;
  if (rotation === prevRotation) {
    return;
  }
  if (Math.abs(rotation - prevRotation) <= 45)  {
    return {
      rotation: prevRotation,
      x: prevX,
      y: prevY,
    }
  }
  if (rotation > 45 && rotation < 90) {
    return {
      rotation: 90,
      x: prevX + width / 2 + height / 2,
      y: prevY - width / 2 + height / 2,
    }
  } else {
    return {
      rotation: 0,
      x: prevX - width / 2 - height / 2,
      y: prevY + width / 2 - height / 2,
    }
  }
}

export const distanceFromTargetCorner = (currentShapeData = {}, targetShapeData = {}) => {
  const {x, y, width, rotation = 0} = currentShapeData;
  const {x: targetX, y: targetY, width: targetWidth, height: targetHeight, strokeWidth} = targetShapeData;
  const realTargetY = targetY - strokeWidth / 2;
  const realTargetX = targetX + strokeWidth / 2;

  if (rotation === 0 && (y === realTargetY || y === realTargetY + targetHeight)) {
    return {
      leftDistance: (x - realTargetX).toFixed(0),
      rightDistance: (realTargetX + targetWidth - strokeWidth - (x + width)).toFixed(0),
      locationForLabel: y === realTargetY ? "top" : "bottom",
    }
  }

  if (rotation === 90 && (x === realTargetX || x === realTargetX + targetWidth)) {
    return {
      leftDistance: (y - realTargetY - strokeWidth).toFixed(0),
      rightDistance: (realTargetY + targetHeight - (y + width)).toFixed(0),
      locationForLabel: x === realTargetX ? "left" : "right",
    }
  }

}