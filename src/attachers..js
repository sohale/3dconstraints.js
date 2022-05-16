'use strict';

/*
    Defines one line of constraint in form of:
        obj0.x - obj1.x = delta_x
    on two Shapes (objects)
    ,where x can be x, y, z
*/
function C_AttachLocation(attrib, delta_x, shape1index, shape2index) {
  this.delta_x = delta_x;
  assert(["x", "y", "z"].indexOf(attrib) > -1);
  this.attrib = attrib;
  this.shape1index = shape1index;
  this.shape2index = shape2index;
}
C_AttachLocation.prototype.getARow = function () {
  return [1, -1];
};
C_AttachLocation.prototype.getB = function () {
  return this.delta_x;
};
/* todo: store in a unified style. this.shape_index = [shape1index, shape2index] */
C_AttachLocation.prototype.getAttribs = function () {
  return [
    [this.shape1index, this.attrib],
    [this.shape2index, this.attrib]
  ];
};
C_AttachLocation.prototype.getDescription = function (objs) {
  return "+1*" + getIndl(objs[this.shape1index]) + ".x" + " + " + "-1*" + getIndl(this.objs[shape2index]) + ".y +" + this.delta_x + "= 0";
};
C_AttachLocation.prototype.getDict = function () {
  return {
    todo: null
  };
}


/*
  Defines one line of constraint in form of:
      obj0.y - obj1.y = delta_y
  on two Shapes
  By default, delta_y is 0.
*/

// C3_AttachY deprecated by C_AttachLocation
function C3_AttachY(delta_y, shape1index, shape2index) {
  this.delta_y = delta_y;
  this.attrib_y = "y";
  this.shape1index = shape1index;
  this.shape2index = shape2index;
}
C3_AttachY.prototype.getARow = function () {
  return [1, -1];
};
C3_AttachY.prototype.getB = function () {
  return this.delta_y;
};
C3_AttachY.prototype.getAttribs = function () {
  return [
    [this.shape1index, this.attrib_y],
    [this.shape2index, this.attrib_y]
  ];
};

/**
  Defines one line of constraint in form of:
      obj0.ax - obj1.ax = delta
  on two Shapes
  where ax can be ax, ay, az

  Note that the numbers *_symbolindex are not the shape index, but they are according to the symbol-table.
*/
function C_AttachAngle(attrib, delta, shape1index, shape2index) {
  if (delta === undefined) {
    delta = 0.0;
  }
  this.delta_a = delta;
  assert(["ax", "ay", "az"].indexOf(attrib) > -1);
  this.attrib_ax = attrib;
  this.shape1index = shape1index;
  this.shape2index = shape2index;
}
C_AttachAngle.prototype.getARow = function () {
  return [1, -1];
};
C_AttachAngle.prototype.getB = function () {
  assert(this.delta_a === 0);
  return this.delta_a;
};
C_AttachAngle.prototype.getAttribs = function () {
  return [
    [this.shape1index, this.attrib_ax],
    [this.shape2index, this.attrib_ax]
  ];
};
/*
function C_AttachAngle(attrib, delta, shape_index_list) {
  if(delta === undefined) {
      delta = 0.0;
  }
  this.delta_a = delta;
  assert(["ax","ay","az"].indexOf(attrib)>-1);
  this.attrib_ax=attrib;
  this.shape_index_list = shape_index_list;
}
C_AttachAngle.prototype.getARow = function(){
  return [1,-1];
};
C_AttachAngle.prototype.getB = function(){
  assert(this.delta_a === 0);
  return this.delta_a;
};
C_AttachAngle.prototype.getAttribs = function(){
  // return [[this.shape1index,this.attrib_ax], [this.shape2index,this.attrib_ax]];
  var l = [];
  for (var i in this.shape_index_list) {
      l.push( [this.shape_index_list[i], this.attrib_ax] );
  }
};

*/

/*
  Defines one line of constraint in form of:
      log(obj0.sx) - log(obj1.sx) = log(ratio)
  i.e.
      obj0.sx = ratio * obj1.sx
  on two Shapes
  where sx can be sx, sy, sz (specified by lsx, lsy, lsz)
*/
function C_AttachScale(attrib, ratio, shape1index, shape2index) {
  //Todo: what about the "log(scale)"?!
  assert(Math.abs(ratio) > 0.000001);
  this.scale_log_ratio = Math.log(ratio);
  assert(["lsx", "lsy", "lsz"].indexOf(attrib) > -1);
  this.log_scale_attrib = attrib;
  this.shape1index = shape1index;
  this.shape2index = shape2index;
}
C_AttachScale.prototype.getARow = function () {
  //Use Log_scale
  return [1, -1];
};
C_AttachScale.prototype.getB = function () {
  return this.scale_log_ratio;
};
C_AttachScale.prototype.getAttribs = function () {
  return [
    [this.shape1index, this.log_scale_attrib],
    [this.shape2index, this.log_scale_attrib]
  ];
};
