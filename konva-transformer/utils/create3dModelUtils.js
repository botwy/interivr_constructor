import {cubeFacesScheme} from "../constants/cubeScheme";

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

const getScaleVertice = (verticeVector, scaleX, scaleY, scaleZ) => {

  return verticeVector.map((dimension, index) => {

    if (index === 0) {
      return dimension * scaleX/2;
    }
    if (index === 1) {
      return dimension * scaleY/2;
    }
    if (index === 2) {
      return dimension * scaleZ/2;
    }

  });

}

const getVerticeObjFormatLine = (faceVertice, {scaleX, scaleY, scaleZ}) => {
  const scaleVerticeVector = getScaleVertice(faceVertice, scaleX, scaleY, scaleZ);

  return ["v",...scaleVerticeVector].join(" ").trim();

}
export const createCubeInObjFormat = (scaleX, scaleY, scaleZ, rectanglesData) => {
  const scaleObj = { scaleX, scaleY, scaleZ };
  const obj3D = [];

  obj3D.push("cube.mtl");

  let verticeGlobalIndex = 0;
  cubeFacesScheme.forEach((cubeFaceData, faceIndex) => {
    obj3D.push("o Cube."+(faceIndex+1));


    const faceVerticesIndexList = [];
    const faceVerticeArr = cubeFaceData.f.slice();
    faceVerticeArr.reverse();

    if (faceIndex === 2) {
      const renderDoor = rectanglesData.door1;
      const room = rectanglesData.room;
      const roomX = room.x +room.width +room.strokeWidth/2;

      if (roomX === renderDoor.x && renderDoor.y > room.y && renderDoor.y < room.y + room.height) {
        const firstVerticeY = 1 - (renderDoor.y - room.y)/150;
        const secondVerticeY = 1 - (renderDoor.y + renderDoor.width - room.y)/150;

        obj3D.push(getVerticeObjFormatLine([1,firstVerticeY,0], scaleObj));
        obj3D.push(getVerticeObjFormatLine([1,firstVerticeY,2], scaleObj));
        obj3D.push(getVerticeObjFormatLine(faceVerticeArr[3], scaleObj));
        obj3D.push(getVerticeObjFormatLine(faceVerticeArr[4], scaleObj));
      }
    }

    faceVerticeArr.forEach((faceVertice) => {

      verticeGlobalIndex++;
      faceVerticesIndexList.push(verticeGlobalIndex);
      obj3D.push(getVerticeObjFormatLine(faceVertice, scaleObj));

    })
    obj3D.push(["vn", ...cubeFaceData.vn].join(" ").trim());

    obj3D.push("usemtl Material."+(faceIndex+1));
    obj3D.push("s off");

    obj3D.push([
      "f",
      ...faceVerticesIndexList.map((verticeIndex) => verticeIndex + "//" + (faceIndex+1))
    ].join(" ").trim());

  })

  return obj3D;
}