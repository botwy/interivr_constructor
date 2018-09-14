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

const get3dModelInObjFormat = (totalObj3dList, scaleObj) => {

  let verticeGlobalIndex = 0;

  const obj3D = [];
  obj3D.push("cube.mtl");
  totalObj3dList.forEach(({ object3dFaceList, normal }, index) => {
    const faceVerticesIndexList = [];

    obj3D.push("o Cube." + (index+1));

    object3dFaceList.forEach(faceVertices => {
      faceVertices.forEach(vertice => {

        obj3D.push(getVerticeObjFormatLine(vertice, scaleObj));
        verticeGlobalIndex++;
        faceVerticesIndexList.push(verticeGlobalIndex);

      })
    })

    obj3D.push(["vn", ...normal].join(" ").trim());
    obj3D.push("usemtl Material."+(index+1));
    obj3D.push("s off");

    object3dFaceList.forEach((faceVertices, step) => {
      obj3D.push([
        "f",
        ...faceVertices
          .map((vertice, index) => (index))
          .map(verticeLocalIndex => (faceVerticesIndexList[verticeLocalIndex + step * faceVertices.length]))
          .map((verticeIndex) => verticeIndex + "//" + (index+1))
      ].join(" ").trim());
    })
  })
 return obj3D;
}

export const createCubeInObjFormat = (scaleX, scaleY, scaleZ, rectanglesData) => {
  const scaleObj = { scaleX, scaleY, scaleZ };
  const totalObj3dList = [];

  cubeFacesScheme.forEach((cubeFaceData, faceIndex) => {

    const faceVerticeArr = cubeFaceData.f.slice();
    faceVerticeArr.reverse();

    if (faceIndex === 2) {
      const renderDoor = rectanglesData.door1;
      const room = rectanglesData.room;
      const roomX = room.x +room.width +room.strokeWidth/2;

      if (roomX === renderDoor.x && renderDoor.y > room.y && renderDoor.y < room.y + room.height) {
        const firstVerticeY = 1 - (renderDoor.y - room.y)/150;
        const secondVerticeY = 1 - (renderDoor.y + renderDoor.width - room.y)/150;
        const firstVerticeZ = 200/150;

        const object3dFaceList = [];
        object3dFaceList.push([
          [1,firstVerticeY,0], [1,firstVerticeY,2], faceVerticeArr[2], faceVerticeArr[3]
        ] )
        object3dFaceList.push([
          [1,secondVerticeY,firstVerticeZ], [1,secondVerticeY,2], [1,firstVerticeY,2], [1,firstVerticeY,firstVerticeZ]
          ])
        object3dFaceList.push([
          faceVerticeArr[0], faceVerticeArr[1], [1,secondVerticeY,2], [1,secondVerticeY,0]
          ])
        totalObj3dList.push({object3dFaceList, normal: cubeFaceData.vn});

        return;
      }
    }

    totalObj3dList.push({object3dFaceList: [faceVerticeArr], normal:cubeFaceData.vn})

  })

  return get3dModelInObjFormat(totalObj3dList, scaleObj);
}