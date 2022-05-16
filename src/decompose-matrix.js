'use strict';

function decomposeMatrix(m) {

  var m = m.slice(0);

  function getEulerXYZ(m) {
    var rotation = new Vector3D(0, 0, 0);
    rotation.y = Math.asin(
      Math.max(-1, Math.min(1, m[2]))
    );
    if (Math.abs(m[2]) < 1) {
      rotation.x = Math.atan2(-m[6], m[10]);
      rotation.z = Math.atan2(-m[1], m[0]);
    } else {
      rotation.x = Math.atan2(m[9], m[5]);
      rotation.z = 0;
    }
    return rotation;
  }

  var translation = new Vector3D(
    m[3],
    m[7],
    m[11]
  );

  var sx = Math.sqrt(
    m[0] * m[0] +
    m[4] * m[4] +
    m[8] * m[8]
  );

  var sy = Math.sqrt(
    m[1] * m[1] +
    m[5] * m[5] +
    m[9] * m[9]
  );

  var sz = Math.sqrt(
    m[2] * m[2] +
    m[6] * m[6] +
    m[10] * m[10]
  );

  var scale = new Vector3D(sx, sy, sz);

  m[0] /= sx; //why ?
  m[4] /= sx;
  m[8] /= sx;

  m[1] /= sy;
  m[5] /= sy;
  m[9] /= sy;

  m[2] /= sz;
  m[6] /= sz;
  m[10] /= sz;

  var rotation = getEulerXYZ(m);

  return {
    'translation': translation,
    'scale': scale,
    'rotation': rotation
  }
}

// https://github.com/sohale/mp5-private/blob/master/frontend/src/webgl/utils.js
