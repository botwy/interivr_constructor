export const roomZ = 2.75;
export const initRoomWidth = 300;
export const initRoomHeight = 300;

export const defaultLocalPosition = {
  floor: {
    f:[[
      [3,3,0],
      [0,3,0],
      [0,0,0],
      [3,0,0],
    ]],
    uv:[
      [0, 1],
      [1, 1],
      [1, 0],
      [0, 0],
    ],
    vn:[0,0,1],
    worldPosition: [2, -0.8, 0],
    worldRotation: [0],
  },
  ceiling: {
    f:[[
      [3, 3, 0],
      [3, 0, 0],
      [0, 0, 0],
      [0, 3, 0],
    ]],
    uv:[
      [0, 1],
      [1, 1],
      [1, 0],
      [0, 0],
    ],
    vn:[0,0,-1],
    worldPosition: [2, -0.8, roomZ],
    worldRotation: [0],
  },
  wall0: {
    f:[[
      [3, 0, 0],
      [3, 0, roomZ],
      [0, 0, roomZ],
      [0, 0, 0],
    ]],
    uv:[
      [0, 1],
      [1, 1],
      [1, 0],
      [0, 0],
    ],
    vn:[-1,0,0],
    worldPosition: [3, -0.8, 0],
    worldRotation: [90],
  },
  wall1: {
    f:[[
      [3, 0, 0],
      [3, 0, roomZ],
      [0, 0, roomZ],
      [0, 0, 0],
    ]],
    uv:[
      [0, 1],
      [1, 1],
      [1, 0],
      [0, 0],
    ],
    vn:[0,1,0],
    worldPosition: [3, -3.8, 0],
    worldRotation: [180],
  },
  wall2: {
    f:[[
      [3, 0, 0],
      [3, 0, roomZ],
      [0, 0, roomZ],
      [0, 0, 0],
    ]],
    uv:[
      [0, 1],
      [1, 1],
      [1, 0],
      [0, 0],
    ],
    vn:[1,0,0],
    worldPosition: [2, -3.8, 0],
    worldRotation: [-90],
  },
  wall3: {
    f:[[
      [3, 0, 0],
      [3, 0, roomZ],
      [0, 0, roomZ],
      [0, 0, 0],
    ]],
    uv:[
      [0, 1],
      [1, 1],
      [1, 0],
      [0, 0],
    ],
    vn:[0,-1,0],
    worldPosition: [2, -0.8, 0],
    worldRotation: [0],
  },
}