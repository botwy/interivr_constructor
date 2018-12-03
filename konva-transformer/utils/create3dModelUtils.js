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

export const get3dModelInObjFormat = (totalObj3dList, scaleObj) => {

  let verticeGlobalIndex = 0;
  let uvGlobalIndex = 0;
  let materialIndex = 1;

  const obj3D = [];
  obj3D.push("cube.mtl");
  totalObj3dList.forEach(({ object3dFaceList, normal, material, uv }, index) => {
    const faceVerticesIndexList = [];
    const uvIndexList = [];

    obj3D.push("o Cube." + (index+1));
    object3dFaceList.forEach(faceVertices => {
      faceVertices.forEach(vertice => {

        obj3D.push(getVerticeObjFormatLine(vertice, scaleObj));
        verticeGlobalIndex++;
        faceVerticesIndexList.push(verticeGlobalIndex);

      })
    })
    if (Array.isArray(uv)) {
      uv.forEach(uvVertices => {
          obj3D.push(["vt",...uvVertices].join(" ").trim());
          uvGlobalIndex++;
          uvIndexList.push(uvGlobalIndex);
      })
    }

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
          .map((verticeIndex, mapIndex) => {
            if (!uvIndexList.length) {
                return verticeIndex + "//" + (index+1)
            }
            return  verticeIndex + "/" + uvIndexList[mapIndex] + "/" + (index+1)
          })
      ].join(" ").trim());
    })
  })
 return obj3D;
}