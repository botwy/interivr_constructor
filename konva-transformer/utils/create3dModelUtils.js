import {cubeFacesScheme} from "../constants/cubeScheme";
import {cubeFoorVerticalDoorFacesScheme} from "../constants/cubeForDoorScheme";
import {shapeType} from "../constants/shapeType";

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
  let materialIndex = 1;

  const obj3D = [];
  obj3D.push("cube.mtl");
  totalObj3dList.forEach(({ object3dFaceList, normal, material }, index) => {
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
    if (material) {
      obj3D.push("usemtl " + material);
    }else {
      obj3D.push("usemtl Material."+materialIndex);
      materialIndex++;
    }

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
const getModelListForDoor = (room, renderDoor, scaleZ, initialPlaneVerticeList, normal) => {
  const resultModelList = [];

  const differenceFromBasicY = (room.y - renderDoor.y)/(room.height*0.5);
  const firstVerticeY = 1 + differenceFromBasicY;
  const secondVerticeY = 1 + (room.y - renderDoor.y - renderDoor.width)/(room.height*0.5);
  const firstVerticeZ = 2/(scaleZ*0.5);

  const object3dFaceList = [];
  object3dFaceList.push([
    [1,firstVerticeY,0], [1,firstVerticeY,2], initialPlaneVerticeList[2], initialPlaneVerticeList[3]
  ] )
  object3dFaceList.push([
    [1,secondVerticeY,firstVerticeZ], [1,secondVerticeY,2], [1,firstVerticeY,2], [1,firstVerticeY,firstVerticeZ]
  ])
  object3dFaceList.push([
    initialPlaneVerticeList[0], initialPlaneVerticeList[1], [1,secondVerticeY,2], [1,secondVerticeY,0]
  ])
  resultModelList.push({object3dFaceList, normal});

  cubeFoorVerticalDoorFacesScheme.forEach(currentObj3d => {
    const object3dFace = currentObj3d.f.map(verticeVector => ([
      verticeVector[0],
      1+differenceFromBasicY+verticeVector[1]*renderDoor.width/(room.height*0.5),
      verticeVector[2]*firstVerticeZ,
    ]));
    resultModelList.push({object3dFaceList: [object3dFace], normal: currentObj3d.vn, material: currentObj3d.mtl});
  })

  return resultModelList;
}

const getShapeFirstVertice = (room, shape) => {
  const k = 1/(room.height*0.5);
  const differenceFromBasicAxis = (room.y - shape.y)*k;
  return 1 + differenceFromBasicAxis;
}
const getShapeSecondVertice = (room, shape) => 1 + (room.y - shape[0].y - shape[0].width)/(room.height*0.5);

const getDoorVerticeZ = (roomHeight, doorHeight) => doorHeight/(roomHeight*0.5);

const getReformModelList = (shapeArr, wallIndex, room, scaleZ, initialPlaneVerticeList, normal) => {
  const resultModelList = [];

  switch (wallIndex) {
    case 0:
     const object3dFaceList = [];
     const firstVertice = getShapeFirstVertice(room, shapeArr[0])

      object3dFaceList.push([
        [1,firstVertice,0], [1,firstVertice,2], initialPlaneVerticeList[2], initialPlaneVerticeList[3]
      ] )
      shapeArr.forEach((shape, index) => {

        const firstVertice = getShapeFirstVertice(room, shape);
        const secondVertice = getShapeSecondVertice(room, shape);
        const verticeZ = getDoorVerticeZ(scaleZ, 2);

        if (index > 0) {
          const prevShapeSecondVertice = getShapeSecondVertice(room, shapeArr[index-1]);
          object3dFaceList.push([
            [1,firstVertice,0], [1,firstVertice,2], [1,prevShapeSecondVertice,2], [1,prevShapeSecondVertice,2]
          ] )
        }
        object3dFaceList.push([
          [1,secondVertice,firstVertice], [1,secondVertice,2], [1,firstVertice,2], [1,firstVertice,verticeZ]
        ])

      })

      const secondVertice = getShapeSecondVertice(room, shapeArr[shapeArr.length-1]);
      object3dFaceList.push([
        initialPlaneVerticeList[0], initialPlaneVerticeList[1], [1,secondVertice,2], [1,secondVertice,0]
      ])
      resultModelList.push({object3dFaceList, normal});

      shapeArr.forEach((shape) => {
        cubeFoorVerticalDoorFacesScheme.forEach(currentObj3d => {
          const object3dFace = currentObj3d.f.map(verticeVector => ([
            verticeVector[0],
            getShapeFirstVertice(room, shape)+verticeVector[1]*shape.width/(room.height*0.5),
            verticeVector[2]*getDoorVerticeZ(scaleZ, 2),
          ]));
          resultModelList.push({object3dFaceList: [object3dFace], normal: currentObj3d.vn, material: currentObj3d.mtl});
        })
      })

      break;
  }
return resultModelList;
}
export const createCubeInObjFormat = (scaleX, scaleY, scaleZ, rectanglesData) => {
  const scaleObj = { scaleX, scaleY, scaleZ };
  const totalObj3dList = [];
  const room = rectanglesData.room;
  const roomX = room.x +room.width +room.strokeWidth/2;

  cubeFacesScheme.forEach((cubeFaceData, faceIndex) => {

    const faceVerticeArr = cubeFaceData.f.slice();
    faceVerticeArr.reverse();

    if (faceIndex === 2) {
      const shapeArr = [];
      Object.keys(rectanglesData).forEach(key => {
        const currentShape = rectanglesData[key];
        if ([shapeType.DOOR, shapeType.WINDOW].includes(currentShape.type) &&
          roomX === currentShape.x && currentShape.y > room.y && currentShape.y < room.y + room.height
        ) {
          shapeArr.push(currentShape);
        }
      })
      shapeArr.sort((shape, shapeNext) => {
        if (shape.y < shapeNext.y) return -1;
        if (shape.y > shapeNext.y) return 1;
        return 0;
      })
      console.log(shapeArr)
      totalObj3dList.push(...getReformModelList(shapeArr, 0, scaleZ, faceVerticeArr, cubeFaceData.vn));
      return;

      const renderDoor = rectanglesData.door1;

      if (roomX === renderDoor.x && renderDoor.y > room.y && renderDoor.y < room.y + room.height) {
        totalObj3dList.push(...getModelListForDoor(room, renderDoor, scaleZ, faceVerticeArr, cubeFaceData.vn));
        return;
      }
    }

    totalObj3dList.push({object3dFaceList: [faceVerticeArr], normal:cubeFaceData.vn})

  })

  return get3dModelInObjFormat(totalObj3dList, scaleObj);
}