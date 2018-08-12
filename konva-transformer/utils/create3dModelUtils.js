export const create3dModel = (shapeList = [], roomHeight) => {
  let new3dModel = {};
  shapeList.forEach(shape => {
      if (shape.type === "room") {
        new3dModel[shape.type] = {
          width: shape.width,
          length: shape.height,
          yHeight: roomHeight,
        };
      }


    }
  )
}