/*
  old: XYZSSSAAA representation where AAA is EulerXYZ

    case 'w': return shape.getLength(); //see getDimsAndCenterOfSelectedObject()
    case 'l': return shape.getWidth();
    case 'h': return shape.getHeight();
    case 'ax':
    case 'ay':
    case 'az':
*/


// old name: getShapeProperties
var getShapeAttribute = function (shape, attrib) {
  assert(shape);
  var d = decomposeMatrix(shape.matrix);
  switch (attrib) {
    case 'x':
      return d.translation.x;
    case 'y':
      return d.translation.y;
    case 'z':
      return d.translation.z;
    case 'sx':
      return d.scale.x;
    case 'sy':
      return d.scale.y;
    case 'sz':
      return d.scale.z;
    case 'ax':
      return d.rotation.x;
    case 'ay':
      return d.rotation.y;
    case 'az':
      return d.rotation.z;

    case 'lsx':
      return Math.log(d.scale.x) / Math.log(10);
    case 'lsy':
      return Math.log(d.scale.y) / Math.log(10);
    case 'lsz':
      return Math.log(d.scale.z) / Math.log(10);

      // not tested:
    case 'm0':
      return shape.matrix[0];
    case 'm1':
      return shape.matrix[1];
    case 'm2':
      return shape.matrix[2];
    case 'm3':
      return shape.matrix[3];
    case 'm4':
      return shape.matrix[4];
    case 'm5':
      return shape.matrix[5];
    case 'm6':
      return shape.matrix[6];
    case 'm7':
      return shape.matrix[7];
    case 'm8':
      return shape.matrix[8];
    case 'm9':
      return shape.matrix[9];
    case 'm10':
      return shape.matrix[10];
    case 'm11':
      return shape.matrix[11];

    default:
      throw "Wrong attribute type";
  }

  //assert(["lsx","lsy","lsz"].indexOf(attrib)==-1);
  /*
  switch(attrib){
      case 'x': return shape.center.x;
      case 'y': return shape.center.y;
      case 'z': return shape.center.z;
      case 'sx': return shape.getLength();
      case 'sy': return shape.getWidth();
      case 'sz': return shape.getHeight();
      case 'ax': return shape.angle.x;
      case 'ay': return shape.angle.y;
      case 'az': return shape.angle.z;

      case 'lsx': return Math.log(shape.getLength())/Math.log(10);
      case 'lsy': return Math.log(shape.getWidth())/Math.log(10);
      case 'lsz': return Math.log(shape.getHeight())/Math.log(10);

      default:
          throw "Wrong attribute type";
  }
  */
};
var _const_log10 = Math.log(10);

function exp10(x) {
  return Math.exp(x * _const_log10);
}
// "apply" the given attribute
// old name: setShapeProperties
var applyShapeAttribute = function (shape, attrib, value) {
  //var dims = getDimsAndCenterOfSelectedObject()[0]; //terrible very inefficient
  assert(!isNaN(value));
  //assert(["lsx","lsy","lsz"].indexOf(attrib)==-1);
  /*
  switch(attrib){
      case 'x': shape.center.x = value; break;
      case 'y': shape.center.y = value; break;
      case 'z': shape.center.z = value; break;
      case 'sx': var xs=value/shape.getLength(); shape.resizeLength(xs); break;
      case 'sy': var ys=value/shape.getWidth(); shape.resizeWidth(ys); break;
      case 'sz': var zs=value/shape.getHeight(); shape.resizeHeight(zs); break;
      case 'ax': shape.angle.x = value; break; //_setGroupAngle([shape], value, 0, 0, false, true, true); break; //terrible very inefficient
      case 'ay': shape.angle.y = value; break; //_setGroupAngle([shape], 0, value, 0, true, false, true); break;
      case 'az': shape.angle.z = value; break; //_setGroupAngle([shape], 0, 0, value, true, true, false); break;

      case 'lsx': xs=exp10(value)/shape.getLength(); shape.resizeLength(xs); break;
      case 'lsy': ys=exp10(value)/shape.getWidth(); shape.resizeWidth(ys); break;
      case 'lsz': zs=exp10(value)/shape.getHeight(); shape.resizeHeight(zs); break;
      default:
          throw "Wrong attribute type";
  }
  */

  function test_transf(shape) {
    var d = decomposeMatrix(shape.matrix);
    var m = getMatrixTransformation(
      d.translation.x, d.translation.y, d.translation.z,
      d.rotation.x, d.rotation.y, d.rotation.z,
      d.scale.x, d.scale.y, d.scale.z);
    if (JSON.stringify(approxMatrix(shape.matrix)) == JSON.stringify(approxMatrix(m))) {
      ;
    } else {
      console.warn(JSON.stringify(approxMatrix(shape.matrix)) + "\n==\n" + JSON.stringify(approxMatrix(m)));
    }
  }

  function approxMatrix(matrix12, decimal_digits) {
    if (!decimal_digits)
      decimal_digits = 5;
    var m = [];
    for (var i = 0; i < 16; i++) {
      m[i] = matrix12[i].toFixed(decimal_digits);
    }
    return m;
  }

  test_transf(shape);

  var matrix_mode = false;
  var d = decomposeMatrix(shape.matrix);

  switch (attrib) {
    /*
    case 'x': shape.matrix[3] = value; break;
    case 'y': shape.matrix[7] = value; break;
    case 'z': shape.matrix[11] = value; break;
    */
    case 'x':
      d.translation.x = value;
      break;
    case 'y':
      d.translation.y = value;
      break;
    case 'z':
      d.translation.z = value;
      break;
    case 'sx':
      var xs = value / d.scale.x;
      d.scale.x = xs;
      break;
    case 'sy':
      var ys = value / d.scale.y;
      d.scale.y = ys;
      break;
    case 'sz':
      var zs = value / d.scale.z;
      d.scale.z = zs;
      break;
    case 'ax':
      d.rotation.x = value;
      break; //_setGroupAngle([shape], value, 0, 0, false, true, true); break; //terrible very inefficient
    case 'ay':
      d.rotation.y = value;
      break; //_setGroupAngle([shape], 0, value, 0, true, false, true); break;
    case 'az':
      d.rotation.z = value;
      break; //_setGroupAngle([shape], 0, 0, value, true, true, false); break;

    case 'lsx':
      var xs = exp10(value) / d.scale.x;
      d.scale.x = xs;
      break;
    case 'lsy':
      var ys = exp10(value) / d.scale.y;
      d.scale.y = ys;
      break;
    case 'lsz':
      var zs = exp10(value) / d.scale.z;
      d.scale.z = zs;
      break;

      // not tested:
    case 'm0':
      shape.matrix[0] = value;
      matrix_mode = true;
      break;
    case 'm1':
      shape.matrix[1] = value;
      matrix_mode = true;
      break;
    case 'm2':
      shape.matrix[2] = value;
      matrix_mode = true;
      break;
    case 'm3':
      shape.matrix[3] = value;
      matrix_mode = true;
      break;
    case 'm4':
      shape.matrix[4] = value;
      matrix_mode = true;
      break;
    case 'm5':
      shape.matrix[5] = value;
      matrix_mode = true;
      break;
    case 'm6':
      shape.matrix[6] = value;
      matrix_mode = true;
      break;
    case 'm7':
      shape.matrix[7] = value;
      matrix_mode = true;
      break;
    case 'm8':
      shape.matrix[8] = value;
      matrix_mode = true;
      break;
    case 'm9':
      shape.matrix[9] = value;
      matrix_mode = true;
      break;
    case 'm10':
      shape.matrix[10] = value;
      matrix_mode = true;
      break;
    case 'm11':
      shape.matrix[11] = value;
      matrix_mode = true;
      break;
      /*
        case 'm12':  shape.matrix[12] = value; matrix_mode = true; break;
        case 'm13':  shape.matrix[13] = value; matrix_mode = true; break;
        case 'm14':  shape.matrix[14] = value; matrix_mode = true; break;
        case 'm15':  shape.matrix[15] = value; matrix_mode = true; break;
       */

    default:
      throw "Wrong attribute type";
  }

  if (!matrix_mode) {
    var m = getMatrixTransformation(
      d.translation.x, d.translation.y, d.translation.z,
      d.rotation.x, d.rotation.y, d.rotation.z,
      d.scale.x, d.scale.y, d.scale.z);
    shape.matrix = m;
  }

};
//todo: Unit tests
