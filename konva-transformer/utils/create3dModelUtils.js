import {cubeFacesScheme} from "../constants/cubeScheme";
import {cubeFoorVerticalDoorFacesScheme} from "../constants/cubeForDoorScheme";
import {shapeType} from "../constants/shapeType";
import {shapeInWallMatch} from "../constants/wallFunction";

const DOOR_HEIGHT = 2;
const WINDOW_HEIGHT = 1.5;
const WINDOW_STEP_FROM_FLOOR = 0.8;

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

const getShapeFirstVertice = (room, shape) => {
  const k = 1/(room.height*0.5);
  const differenceFromBasicAxis = (room.y - shape.y)*k;
  return 1 + differenceFromBasicAxis;
}
const getShapeFirstVertice2 = (room, shape) => {
  const k = 1/(room.height*0.5);
  const differenceFromBasicAxis = (room.y+room.height - shape.y-shape.width)*k;
  return -1 + differenceFromBasicAxis;
}
const getShapeSecondVertice = (room, shape) => 1 + (room.y - shape.y - shape.width)/(room.height*0.5);
const getShapeSecondVertice2 = (room, shape) => -1 + (room.y+room.height - shape.y)/(room.height*0.5);

const getDoorVerticeZ = (roomHeight, doorHeight) => doorHeight/(roomHeight*0.5);

const getWindowFirstZ = (roomHeight, windowStepFromFloor) => windowStepFromFloor/(roomHeight*0.5);

const getWindowSecondZ = (roomHeight, windowStepFromFloor, windowHeight) => (windowStepFromFloor+windowHeight)/(roomHeight*0.5);

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
        const verticeZ = getDoorVerticeZ(scaleZ, DOOR_HEIGHT);
        const windowFirstZ = getWindowFirstZ(scaleZ, WINDOW_STEP_FROM_FLOOR);
        const windowSecondZ = getWindowSecondZ(scaleZ,WINDOW_STEP_FROM_FLOOR, WINDOW_HEIGHT);

        if (index > 0) {
          const prevShapeSecondVertice = getShapeSecondVertice(room, shapeArr[index-1]);
          object3dFaceList.push([
            [1,firstVertice,0], [1,firstVertice,2], [1,prevShapeSecondVertice,2], [1,prevShapeSecondVertice,0]
          ] )
        }
        if (shape.type === shapeType.WINDOW) {
          object3dFaceList.push([
            [1,secondVertice,0], [1,secondVertice,windowFirstZ], [1,firstVertice,windowFirstZ], [1,firstVertice,0]
          ])
          object3dFaceList.push([
            [1,secondVertice,windowSecondZ], [1,secondVertice,2], [1,firstVertice,2], [1,firstVertice,windowSecondZ]
          ])
          return;
        }

        object3dFaceList.push([
          [1,secondVertice,verticeZ], [1,secondVertice,2], [1,firstVertice,2], [1,firstVertice,verticeZ]
        ])

      })

      const secondVertice = getShapeSecondVertice(room, shapeArr[shapeArr.length-1]);
      object3dFaceList.push([
        initialPlaneVerticeList[0], initialPlaneVerticeList[1], [1,secondVertice,2], [1,secondVertice,0]
      ])
      resultModelList.push({object3dFaceList, normal});

      shapeArr.forEach((shape) => {
        if (shape.type === shapeType.WINDOW) {
          cubeFoorVerticalDoorFacesScheme.forEach(currentObj3d => {
            const object3dFace = currentObj3d.f.map(verticeVector => ([
              verticeVector[0],
              getShapeFirstVertice(room, shape)+verticeVector[1]*shape.width/(room.height*0.5),
              getWindowFirstZ(scaleZ, WINDOW_STEP_FROM_FLOOR, WINDOW_HEIGHT) + verticeVector[2]*(
                getWindowSecondZ(scaleZ, WINDOW_STEP_FROM_FLOOR, WINDOW_HEIGHT) - getWindowFirstZ(scaleZ,WINDOW_STEP_FROM_FLOOR)
              ),
            ]));
            resultModelList.push({object3dFaceList: [object3dFace], normal: currentObj3d.vn, material: currentObj3d.mtl});
          })
          return;
        }

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

    case 2:
      const object3dFaceList2 = [];
      const firstVertice2 = getShapeFirstVertice2(room, shapeArr[0])

      object3dFaceList2.push([
        [-1,firstVertice2,2], [-1,firstVertice2,0], initialPlaneVerticeList[1], initialPlaneVerticeList[0]
      ] )
      shapeArr.forEach((shape, index) => {

        const firstVertice = getShapeFirstVertice2(room, shape);
        const secondVertice = getShapeSecondVertice2(room, shape);
        const verticeZ = getDoorVerticeZ(scaleZ, DOOR_HEIGHT);
        const windowFirstZ = getWindowFirstZ(scaleZ, WINDOW_STEP_FROM_FLOOR);
        const windowSecondZ = getWindowSecondZ(scaleZ,WINDOW_STEP_FROM_FLOOR, WINDOW_HEIGHT);

        if (index > 0) {
          const prevShapeSecondVertice = getShapeSecondVertice2(room, shapeArr[index-1]);
          object3dFaceList2.push([
            [-1,firstVertice,2], [-1,firstVertice,0], [-1,prevShapeSecondVertice,0], [-1,prevShapeSecondVertice,2]
          ] )
        }
        if (shape.type === shapeType.WINDOW) {
          object3dFaceList2.push([
            [-1,secondVertice,windowFirstZ], [-1,secondVertice,0], [-1,firstVertice,0], [-1,firstVertice,windowFirstZ]
          ])
          object3dFaceList2.push([
            [-1,secondVertice,2], [-1,secondVertice,windowSecondZ], [-1,firstVertice,windowSecondZ], [-1,firstVertice,2]
          ])
          return;
        }

        object3dFaceList2.push([
          [-1,secondVertice,2], [-1,secondVertice,verticeZ], [-1,firstVertice,verticeZ], [-1,firstVertice,2]
        ])

      })

      const secondVertice2 = getShapeSecondVertice2(room, shapeArr[shapeArr.length-1]);
      object3dFaceList.push([
        initialPlaneVerticeList[0], initialPlaneVerticeList[1], [1,secondVertice2,2], [1,secondVertice2,0]
      ])
      resultModelList.push({object3dFaceList2, normal});

      shapeArr.forEach((shape) => {
        if (shape.type === shapeType.WINDOW) {
          cubeFoorVerticalDoorFacesScheme.forEach(currentObj3d => {
            const object3dFace = currentObj3d.f.map(verticeVector => ([
              verticeVector[0],
              getShapeFirstVertice(room, shape)+verticeVector[1]*shape.width/(room.height*0.5),
              getWindowFirstZ(scaleZ, WINDOW_STEP_FROM_FLOOR, WINDOW_HEIGHT) + verticeVector[2]*(
                getWindowSecondZ(scaleZ, WINDOW_STEP_FROM_FLOOR, WINDOW_HEIGHT) - getWindowFirstZ(scaleZ,WINDOW_STEP_FROM_FLOOR)
              ),
            ]));
            resultModelList.push({object3dFaceList: [object3dFace], normal: currentObj3d.vn, material: currentObj3d.mtl});
          })
          return;
        }

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

    if ([2,3,4,5].includes(faceIndex)) {
      const shapeArr = [];
      Object.keys(rectanglesData).forEach(key => {
        const currentShape = rectanglesData[key];
        if ([shapeType.DOOR, shapeType.WINDOW].includes(currentShape.type) && shapeInWallMatch[faceIndex-2](room, currentShape)) {
          shapeArr.push(currentShape);
        }
      })
      shapeArr.sort((shape, shapeNext) => {
        if (shape.y < shapeNext.y) return -1;
        if (shape.y > shapeNext.y) return 1;
        return 0;
      })

      if (shapeArr.length > 0) {
        totalObj3dList.push(...getReformModelList(shapeArr, faceIndex-2, room, scaleZ, faceVerticeArr, cubeFaceData.vn));
        return;
      }
    }

    totalObj3dList.push({object3dFaceList: [faceVerticeArr], normal:cubeFaceData.vn})

  })

  return get3dModelInObjFormat(totalObj3dList, scaleObj);
}