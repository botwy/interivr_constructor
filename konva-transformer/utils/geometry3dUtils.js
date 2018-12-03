const getRoomFloor = ({x, y, width, height}, centerOffsetX, centerOffsetY) => {
return (
  {
    f:[
      [x + width + centerOffsetX, -y + centerOffsetY, 0],
      [x + centerOffsetX, -y + centerOffsetY, 0],
      [x + centerOffsetX, -y - height + centerOffsetY, 0],
      [x + width + centerOffsetX, -y - height + centerOffsetY, 0],
    ],
    uv:[
      [0, 1],
      [1, 1],
      [1, 0],
      [0, 0],
    ],
    vn:[0,0,1]
  }
);
}

const getRoomCeiling = ({x, y, width, height}, centerOffsetX, centerOffsetY) => {
  return (
    {
      f:[
        [x + width + centerOffsetX, -y + centerOffsetY, 0],
        [x + width + centerOffsetX, -y - height + centerOffsetY, 0],
        [x + centerOffsetX, -y - height + centerOffsetY, 0],
        [x + centerOffsetX, -y + centerOffsetY, 0],
      ],
      uv:[
        [0, 1],
        [1, 1],
        [1, 0],
        [0, 0],
      ],
      vn:[0,0,1]
    }
  );
}

const getRoomWall0 = ({x, y, width, height, roomZ}, centerOffsetX, centerOffsetY) => {
  return (
    {
      f:[
        [x + width + centerOffsetX, -y - height + centerOffsetY, 0],
        [x + width + centerOffsetX, -y - height + centerOffsetY, roomZ],
        [x + width + centerOffsetX, -y + centerOffsetY, roomZ],
        [x + width + centerOffsetX, -y + centerOffsetY, 0],
      ],
      uv:[
        [0, 1],
        [1, 1],
        [1, 0],
        [0, 0],
      ],
      vn:[0,0,1]
    }
  );
}

const getRoomWall1 = ({x, y, width, height, roomZ}, centerOffsetX, centerOffsetY) => {
  return (
    {
      f:[
        [x + centerOffsetX, -y - height + centerOffsetY, 0],
        [x + centerOffsetX, -y - height + centerOffsetY, roomZ],
        [x + width + centerOffsetX, -y - height + centerOffsetY, roomZ],
        [x + width + centerOffsetX, -y - height + centerOffsetY, 0],
      ],
      uv:[
        [0, 1],
        [1, 1],
        [1, 0],
        [0, 0],
      ],
      vn:[0,0,1]
    }
  );
}

const getRoomWall2 = ({x, y, width, height, roomZ}, centerOffsetX, centerOffsetY) => {
  return (
    {
      f:[
        [x + centerOffsetX, -y + centerOffsetY, 0],
        [x + centerOffsetX, -y + centerOffsetY, roomZ],
        [x + centerOffsetX, -y - height + centerOffsetY, roomZ],
        [x + centerOffsetX, -y - height + centerOffsetY, 0],
      ],
      uv:[
        [0, 1],
        [1, 1],
        [1, 0],
        [0, 0],
      ],
      vn:[0,0,1]
    }
  );
}

const getRoomWall3 = ({x, y, width, height, roomZ}, centerOffsetX, centerOffsetY) => {
  return (
    {
      f:[
        [x + width + centerOffsetX, -y + centerOffsetY, 0],
        [x + width + centerOffsetX, -y + centerOffsetY, roomZ],
        [x + centerOffsetX, -y + centerOffsetY, roomZ],
        [x + centerOffsetX, -y + centerOffsetY, 0],
      ],
      uv:[
        [0, 1],
        [1, 1],
        [1, 0],
        [0, 0],
      ],
      vn:[0,0,1]
    }
  );
}

export const getRoom3dModel = (changedShapeData = {}, roomZ) => {
  const x = changedShapeData.x/100;
  const y = changedShapeData.y/100;
  const z = roomZ/100;
  const width = changedShapeData.width/100;
  const height = changedShapeData.height/100;

  const centerOffsetX = - x - width/2;
  const centerOffsetY =  y + height/2;

  const floor = getRoomFloor({x, y, height, width}, centerOffsetX, centerOffsetY);
  const ceiling = getRoomCeiling({x, y, height, width}, centerOffsetX, centerOffsetY);
  const wall0 = getRoomWall0({x, y, height, width, roomZ: z}, centerOffsetX, centerOffsetY);
  const wall1 = getRoomWall1({x, y, height, width, roomZ: z}, centerOffsetX, centerOffsetY);
  const wall2 = getRoomWall2({x, y, height, width, roomZ: z}, centerOffsetX, centerOffsetY);
  const wall3 = getRoomWall3({x, y, height, width, roomZ: z}, centerOffsetX, centerOffsetY);

  return {...changedShapeData.model3d, floor, ceiling, wall0, wall1, wall2, wall3}
}

const changeRoomWall0 = ({x, y, width, height, roomZ},  {roomDataX, roomDataY, roomDataWidth, roomDataHeight}, centerOffsetX, centerOffsetY) => {
  const shapeZ = 200/100;
  const newFace = [
      [
        [roomDataX + roomDataWidth + centerOffsetX, - roomDataY - roomDataHeight + centerOffsetY, 0],
        [roomDataX + roomDataWidth + centerOffsetX, - roomDataY - roomDataHeight + centerOffsetY, roomZ],
        [roomDataX + roomDataWidth + centerOffsetX, - y - height/2 - width + centerOffsetY, roomZ],
        [roomDataX + roomDataWidth + centerOffsetX, - y - height/2 - width + centerOffsetY, 0],
      ],
      [
        [roomDataX + roomDataWidth + centerOffsetX, - y - height/2 - width + centerOffsetY, shapeZ],
        [roomDataX + roomDataWidth + centerOffsetX, - y - height/2 - width + centerOffsetY, roomZ],
        [roomDataX + roomDataWidth + centerOffsetX, - y - height/2 + centerOffsetY, roomZ],
        [roomDataX + roomDataWidth + centerOffsetX, - y - height/2 + centerOffsetY, shapeZ],
      ],
      [
        [roomDataX + roomDataWidth + centerOffsetX, - y - height/2 + centerOffsetY, 0],
        [roomDataX + roomDataWidth + centerOffsetX, - y - height/2 + centerOffsetY, roomZ],
        [roomDataX + roomDataWidth + centerOffsetX, - roomDataY + centerOffsetY, roomZ],
        [roomDataX + roomDataWidth + centerOffsetX, - roomDataY + centerOffsetY, 0],
      ],
    ]

  return (
    {
      f: newFace,
      uv:[
        [0, 1],
        [1, 1],
        [1, 0],
        [0, 0],
      ],
      vn:[0,0,1]
    }
  );
}

export const getRoom3dModelAfterAttractShape = (changedShapeData = {}, roomZ, roomData = {}) => {
  const x = changedShapeData.x/100;
  const y = changedShapeData.y/100;
  const z = roomZ/100;
  const width = changedShapeData.width/100;
  const height = changedShapeData.height/100;

  const roomDataX = roomData.x/100;
  const roomDataY = roomData.y/100;
  const roomDataWidth = roomData.width/100;
  const roomDataHeight = roomData.height/100;

  const centerOffsetX = - roomDataX - roomDataWidth/2;
  const centerOffsetY =   roomDataY + roomDataHeight/2;

  const newWall0 = changeRoomWall0(
    {x, y, height, width, roomZ: z},
    {roomDataX, roomDataY, roomDataWidth, roomDataHeight},
    centerOffsetX,
    centerOffsetY
    );


  return {...roomData.model3d, wall0: newWall0}
}

export const scaleVerticesMatrixForX = (verticesMatrix = {}, scaleX) => {
  return [
    [verticesMatrix[0][0] * scaleX, verticesMatrix[0][1], verticesMatrix[0][2]],
    [verticesMatrix[1][0] * scaleX, verticesMatrix[1][1], verticesMatrix[1][2]],
    [verticesMatrix[2][0] * scaleX, verticesMatrix[2][1], verticesMatrix[2][2]],
    [verticesMatrix[3][0] * scaleX, verticesMatrix[3][1], verticesMatrix[3][2]],
  ]
}
export const scaleVerticesMatrixForY = (verticesMatrix = {}, scaleY) => {
  return [
    [verticesMatrix[0][0], verticesMatrix[0][1] * scaleY, verticesMatrix[0][2]],
    [verticesMatrix[1][0], verticesMatrix[1][1] * scaleY, verticesMatrix[1][2]],
    [verticesMatrix[2][0], verticesMatrix[2][1] * scaleY, verticesMatrix[2][2]],
    [verticesMatrix[3][0], verticesMatrix[3][1] * scaleY, verticesMatrix[3][2]],
  ]
}