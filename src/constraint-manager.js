'use strict';

var ConstraintManager = function (constr2, mainModel) {

  //Is there a reason why the following is not a member?
  //this.constr2_ = constr2;  // new

  // Note that this.constr2_ is the source of Symbole Table and MAtres,
  // which are careated by prepareST() and prepareCompileMatrices()

  // Each method receives it as a separate input.

  this.constraintList = constr2; // Array of AttachAngle() , etc.

  // this.shape_index_lookup_table = {};
  //this.bigindex_to_smallindex_lookup = this.bigindex_to_smallindex(total_shape_index_list);

  var total_shape_index_list = this.make_total_shape_index_list(constr2);
  this.shape3d_list = null;
  this.prepareST(this.constraintList, total_shape_index_list);
  this.prepareCompileMatrices(this.constraintList, total_shape_index_list);


  // Union the actual Shape3D objects, not indices.
  var shape3d_list = shapes_from_target_list(total_shape_index_list, mainModel);

  this.setShapes(shape3d_list);
};


ConstraintManager.prototype.make_total_shape_index_list = function (constr2) {
  var total_shapeindexlist_involved = [];
  console.error("**************");

  var constraints_dict = constr2;

  var constr_list = [];
  for (var ci = 0; ci < constraints_dict.length; ci++) {
    //var shapes_idx = constraints_dict[ci].shapes_idx;
    var shapes_idx = constraints_dict[ci].getAttribs();
    for (var si = 0; si < shapes_idx.length; si++) {
      // Union the actual shape indices objects, not indices.
      var attr_tuple = shapes_idx[si]; // [big_index, attrib_name]
      var _shapes_involved_bigindex = attr_tuple[0]; // big_index
      if (total_shapeindexlist_involved.indexOf(_shapes_involved_bigindex) == -1) {
        total_shapeindexlist_involved.push(_shapes_involved_bigindex);
      }
      /*
      for (var i=0; i < _shapes_involved_bigindex.length; ++i) {
          if (total_shapeindexlist_involved.indexOf(_shapes_involved_bigindex[i]) == -1) {
              total_shapeindexlist_involved.push(_shapes_involved_bigindex[i]);
          }
      }
      */
    }
  }
  console.info(total_shapeindexlist_involved);
  return total_shapeindexlist_involved;
}

//ConstraintManager.prototype.bigindex_to_smallindex = function () {
/*
// reverse lookup
this.shape3d_lookup = {};
for (var i = 0; i < shape3d_list.length; ++i) {
    var shape3d = shape3d_list[i];
    _expect(shape3d.index, "The shape must have an index to work with constaints (and collaboration).");
    if (this.shape3d_lookup[shape3d.index]) {
        _expect( this.shape3d_lookup[shape3d.index] === shape3d, "inconsistency in index-shape mapping. Probably the index of a shape has been modified.");
    }
    this.shape3d_lookup[shape3d.index] = shape3d;
}
*/
//}

ConstraintManager.prototype.prepareST = function (constr2, total_shape_index_list) {
  this.symbolTable = new CSymbolTable(constr2, total_shape_index_list);
  // this.symbolTable = new CSymbolTable();
  // this.symbolTable.makeSymboleTable(constr2);
  assert(this.symbolTable.s.length < 100);
  //var v= makeZeroVector(this.s.length);
};
//The calculation that is called once for all later calls to the .apply() (which applies the constriants by multiplying a P matrix. The P is created and calculated here for later use.)
//Creates one single consistent constaint from a list (First A from the list, and then P from A).
//Builds the projection matrix P (projection onto A's nullspace) and then in .apply() the matrix P is simply multiplied.
//Should be called at each update to the constraint, e.g. adding and removing constraints, objects, formula, parameters, etc.
ConstraintManager.prototype.prepareCompileMatrices = function (constr2, total_bigindex_list) {
  //Ax-B=0

  //this.A = [[1,0],[0,1]];
  //this.B = [0,0];
  //this.A = [[1,-1,-20]];
  //this.B = [0,0];


  //this.A = [[1,-1]];
  //this.B = [-0*100];

  //this.A = [ constr1.getARow() ];
  //this.B = [ constr1.getB()];
  /*
  this.A = [ ];
  this.B = [ ];
  */
  /*
	for(var i=0;i<constr2.length;i++){
		var constr_1 = constr2[i];
		this.A.push( constr_1.getARow() );
		this.B.push( constr_1.getB() );
	}
    */

  var bigsmall_lookup = this.symbolTable.make_bigsmall_lookup(total_bigindex_list);

  var n = this.symbolTable.getAttribCount();
  var m = constr2.length;
  this.A = makeZeros(m, n); //numeric['*'](numeric.identity(n),0);
  this.B = makeZeroVector(m);

  for (var ri = 0; ri < constr2.length; ri++) {
    var constr_1 = constr2[ri];
    //this.A.push( constr_1.getARow() );
    //this.B.push( constr_1.getB() );
    var attrL = constr_1.getAttribs(); // [ [sh,"attribname"], ... ]
    var coefs = constr_1.getARow(); // [ [sh,"attribname"], ... ]
    var cte = constr_1.getB(); //scalar
    //assert(attrL.length == attrL.length);**
    //assert(attrL.length == cte.length);**
    for (var vari = 0; vari < attrL.length; vari++) {
      var pair = attrL[vari];
      var bigindex = pair[0];
      var attrName = pair[1];
      var small_index = bigsmall_lookup[bigindex];
      var idx = this.symbolTable.getEquationIndex(small_index, attrName);
      this.A[ri][idx] = coefs[vari];
    }
    this.B[ri] = cte;
  }

  console.log(numeric.prettyPrint(this.A));
  console.log(numeric.prettyPrint(this.B));

  var r = optimalLinearProjection(this.A, this.B);
  this.P = r.P;
  this.Q = r.Q;
  this.projection = r;
};

//todo: add, remove
ConstraintManager.prototype.setShapes = function (shape3d_list) { //(sh1,sh2) {
  //shape_index_list is an array of type Shape


  //this.shape3d_list[0]= getTreeObj(sh1_Indl);
  //this.shape3d_list = [sh1,sh2];
  this.shape3d_list = shape3d_list;

  /*
  // reverse lookup
  this.shape3d_lookup = {};
  for (var i = 0; i < shape3d_list.length; ++i) {
      var shape3d = shape3d_list[i];
      _expect(shape3d.index, "The shape must have an index to work with constaints (and collaboration).");
      if (this.shape3d_lookup[shape3d.index]) {
          _expect( this.shape3d_lookup[shape3d.index] === shape3d, "inconsistency in index-shape mapping. Probably the index of a shape has been modified.");
      }
      this.shape3d_lookup[shape3d.index] = shape3d;
  }
  */

  notifyConstraintChange();
};
//todo: addShapes

/*
ConstraintManager.prototype.unsetShape = function(sh_Indl,sh2_Indl){
    assert(this.shapeIsInvolved(sh1_Indl) || this.shapeIsInvolved(sh2_Indl) );
    this.total_shape3d_list = null; //temporary solution. Actually should remove a constraint from a list.
}
*/
ConstraintManager.prototype._unsetShapes = function () {
  this.total_shape3d_list = []; //temporary solution. Actually should remove a constraint from a list.
};

ConstraintManager.prototype.getInvolvedShapes = function () {
  // return getShapesFromIndlList(this.objs);
  return this.total_shape3d_list;
};
/*
ConstraintManager.prototype.getAttribList = function(){
	//return [[0,"x"],[1,"y"]];
	//return constr1.getAttribList();
	return this.makeSymboleTable(constr2_);
}
*/


ConstraintManager.prototype.getValues = function () {
  console.log("move 'this.shape3d_list' into constrains`");
  //var sh = getShapesFromIndlList(this.shape3d_list);
  //console.log(sh);
  //numeric.
  //return [sh[0].x,sh[1].y, 1];
  //return [getShapeProperties(sh[0],"x"), getShapeProperties(sh[1],"y"), 1.0]; //for numericJS
  //var a=this.getAttribList(); //[[0,"x"],[1,"y"]];
  /*
    this.symbolTable = new CSymbolTable();
    this.symbolTable.makeSymboleTable(constr2_);
	assert(this.symbolTable.s.length<100);
    */
  var v = makeZeroVector(this.symbolTable.s.length); //bad: access to s
  this.symbolTable.setVFromShapes(this.shape3d_list, v);
  return v;
};
//unittest:
//setValues and then getValues
//getValues and then setValues

ConstraintManager.prototype.setValues = function (v) {
  //var sh = getShapesFromIndlList(this.shape3d_list); //sh = Indl indices
  //sh[0].x=v[0];
  //sh[1].y=v[1];
  //console.log(v[2]); //should be 1.0

  assert(!numeric.any(numeric.isNaN(v)));
  assert(numeric.all(numeric.isFinite(v)));
  //todo: check range:
  //add range


  //assert(Math.abs(v[2]-1.0)<0.0001);
  //console.log(v);
  //var a=[[0,"x"],[1,"y"]];
  /*
	var a=this.getAttribList(); ****
	var ctr=0;
	for(var i=0;i<a.length;i++){
		var sh_idx= a[i][0];
		var attrib_name = a[i][1];
        if(!(ctr<v.length))
            console.log("oh no");
        assert(ctr<v.length);
		setShapeProperties(sh[sh_idx], attrib_name, v[ctr]);
		ctr++;
	}
    */
  this.symbolTable.setShapesFromV(this.shape3d_list, v);
  //setShapeProperties(sh[0],"x", v[0]);
  //setShapeProperties(sh[1],"y", v[1]);
};
ConstraintManager.prototype.apply = function () {
  if (!this.shape3d_list)
    //constraint list is empty
    return;

  var x = this.getValues();
  //console.log(x);
  //Matrix form
  //x = numeric.dot(this.P,x); //Apply the projection matrix
  if (!"trivial")
    //trivial form
    x[1] = x[0] + 10;
  else {
    //console.log(x);
    var new_x = PQproject(this.projection, x);
    assert(!numeric.any(numeric.isNaN(x)));
    assert(numeric.all(numeric.isFinite(x)));
    x = new_x;
    //console.log(x);
  }
  //console.log(x);
  this.setValues(x);
  //updateScene(false);

  //This is at the same architectural level as Api.rotate(). Should push into the shapeUpdateListQueue_forupdateMesh for the next updateMeshFromShape_recursive.
};
ConstraintManager.prototype.noConstraints = function () {
  //i.e. isEmpty
  return !this.shape3d_list;
};
//Returns a list of constraints to display on interface. Each constraint is a string.
//todo: Ali: The right sidebar should reflect this using AngularJS.
ConstraintManager.prototype.getDescriptions = function () {
  if (this.noConstraints())
    return []; //empty list becasue there are no constraints
  //var l = getShapesFromIndlList(this.shape3d_list);
  //var l = targetListFromMeshes(currentMeshes);
  //var sh = this.getInvolvedShapes();
  //return [[l[0],"x"],[l[1],"y"]]; //list of variables
  //return [""+l[0]+".x",""+l[1]+".y"]; //list of variables
  var constrDescription = "+1*" + this.shape3d_list[0] + ".x" + " + " + "-1*" + this.shape3d_list[1] + ".y" + "-10" + "= 0"; //fixme: use const2_
  //constr2_[i].getDescription();
  return [constrDescription];
};

ConstraintManager.prototype.parse = function (equation) {
  //as if : .setDescription()
  alert("not implemented");
};
/** According to the shapes arrray, not the actual constraint objects. */
ConstraintManager.prototype.shapeIsInvolved = function (shape3d) {
  assert(isAnyShape3D(shape3d));
  var shape3d_list = this.getInvolvedShapes();
  for (var i in shape3d_list) {
    var same_shapeobject_Indl = getIndl(shape3d) == getIndl(shape3d_list[i]);
    var same_shapeobject_ref = shape3d_list[i] == shape3d;
    assert(same_shapeobject_Indl == same_shapeobject_ref);
    if (same_shapeobject_ref)
      return true;
  }
  return false;
};
ConstraintManager.prototype.shapeIndexIsInvolved = function (shape_index) {
  var shape3d = this.lookupShape3dIndex(shape_index);
  return this.shapeIsInvolved(shape3d);
};

ConstraintManager.prototype.lookupShape3dIndex = function (shape_index) {
  throw "Not implemented";
  return null;
}

/*
//Returns a list of indices fo the constraints invovled with shape. For now: It's just either [0] or []
ConstraintManager.prototype.getConstriantsInvolved = function(shape){
    //assert(isObjectShapeInTree());
    if(this.shapeIsInvolved(shape))
        return [0];
    else
        return [];
};
*/

//This method is called when you delete a shape3d object fromt the scene and you want to remove all the relevant constraints.
//If you want to protect the constraints, first check using theConstraint.shapeIsInvolved(shape3d)
ConstraintManager.prototype.deleteShape = function (constr2, shape3d) {
  console.log("deleteShape " + getIndl(shape3d));
  var notifyNecessary = false;
  //for each contraint:
  throw "list of constrints";
  var constraintList = constr2;
  for (var i = 0; i < constraintList.length; ++i) { //list of constraints. For now we have one only.
    var a = constraintList[i];
    if (a.shapeIsInvolved(shape3d))
    // if(this.shapeIsInvolved(shape3d))
    {
      // todo:
      a._unsetShapes();
      notifyNecessary = true;
      this._unsetShapes(); //delete the whole constraint (one constraint)
      //fixme: now if it doesnt exist, just ignores it. Necessary for deleting one among multiple shapes onvolved.
    }
  }
  if (notifyNecessary) {
    //todo: refactor (FIXME: dependence to global variable constr2_ must be removed)

    // TODO: get constr2_ from theConstraint
    var total_shape_index_list = this.make_total_shape_index_list(constraintList);
    this.prepareST(constraintList, total_shape_index_list);
    this.prepareCompileMatrices(constraintList, total_shape_index_list); //apply the changes to the projection matrix
    notifyConstraintChange();
  }
};

//This is called for the purpose of removing the shape, not for the purpose of removing the constraint per se.
ConstraintManager.prototype.removeAllInvolvedConstraints = function (constr2, shapeArray) {
  for (var i in shapeArray)
    this.deleteShape(constr2, shapeArray[i]);
};

//Removes one constraint from the list of constraints
ConstraintManager.prototype.removeConstraint = function (idx) {
  assert(idx === 0);

  //closely related, but not equivalent to ._unsetShapes()
  this.shape3d_list = null;
};
