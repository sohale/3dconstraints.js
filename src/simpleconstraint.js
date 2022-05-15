/**
 * author: Sohail Siadat
 */

/*
Usage: Test functions:

InterFace.defineConstraint_default();  // main one
InterFace.dancePartners2();
applySimpleConstraints();

//dont use this from outside:
_defineConstraintFromJSON(json) // remove from InterFace

// self-tests
more_tests();
test_P();

*/

var makeZeroVector = function (n) {
  var v = [];
  for (var i = 0; i < n; i++) {
    v.push(0.0);
  }
  return v;
};

var makeZeros = function (m, n) {
  //return numeric['*'](numeric.identity(n),0);
  var ret = Array(m);
  for (var i = 0; i < m; i++) {
    var foo = Array(n);
    for (var j = 0; j < n; j++)
      foo[j] = 0.0;
    ret[i] = foo;
  }
  assert(numeric.dim(ret)[0] == m);
  assert(numeric.dim(ret)[1] == n);
  return ret;
};



function makeDiagonal(m, n, diags) {
  var SS = makeZeros(m, n);
  for (var i in diags)
    SS[i][i] = diags[i];
  return SS;
}
// *******************************************

function proper_svd(A) {
  //var svd=numeric.svd(A);
  //var E=numeric.dot(numeric.dot(svd.U,numeric.diag(svd.S)),svd.V);
  //new numeric.T(A).transjugate
  //var E=numeric.dot(numeric.dot(svd.U,numeric.diag(svd.S)),new numeric.T(svd.V).transjugate())
  //var sigma = numeric.diag(svd.S);
  //var V=svd.V;var U=svd.U;
  var EPS = 0.0000001;
  var svd0, dim_u, dim_v, dim_s;

  var dim_a = numeric.dim(A);
  if (dim_a[0] >= dim_a[1]) {
    svd0 = numeric.svd(A);
    dim_u = numeric.dim(svd0.U);
    dim_v = numeric.dim(svd0.V);
    dim_s = numeric.dim(svd0.S);
    dim_a = numeric.dim(A);

    if (dim_u[0] == dim_u[1] && dim_v[0] == dim_v[1] && dim_u[0] == dim_a[0] && dim_v[0] == dim_a[1])
      if (dim_s[0] == dim_a[0] && dim_s[1] == dim_a[1]) {
        console.log("Old SVD worked");
        return {
          U: svd0.U,
          S: makeDiagonal(dim_a[0], dim_a[1], svd0.S),
          V: svd0.V
        };

      }
  } else {
    //console.log("Solution 2:");
    svd0 = numeric.svd(numeric.transpose(A));
    dim_a = numeric.dim(A);
    var Sd = makeDiagonal(dim_a[0], dim_a[1], svd0.S);
    dim_u = numeric.dim(svd0.V);
    dim_v = numeric.dim(svd0.U);
    dim_s = numeric.dim(Sd);

    var correct_V = svd0.U;
    dim_v = numeric.dim(correct_V);
    if (dim_v[0] != dim_v[1]) {
      //console.log("A^T A");
      //The V (which is A's U) is still not generated correctly.
      var svd_ATA = numeric.svd(numeric.dotMMsmall(numeric.transpose(A), A));
      correct_V = svd_ATA.U; //either U or V
      //console.log("A^T A done");
      //console.log("V");
    }
    dim_v = numeric.dim(correct_V);

    var correct_U = svd0.V;
    dim_u = numeric.dim(correct_U);
    if (dim_u[0] != dim_u[1]) {
      console.log("A A^T");
      //The V (which is A's U) is still not generated correctly.
      var svd_AAT = numeric.svd(numeric.dotMMsmall(A, numeric.transpose(A)));
      correct_U = svd_AAT.V; //either U or V
      console.log("A A^T done");
      console.log("U");
    }
    dim_u = numeric.dim(correct_U);


    if (dim_u[0] == dim_u[1] && dim_v[0] == dim_v[1] && dim_u[0] == dim_a[0] && dim_v[0] == dim_a[1])
      if (dim_s[0] == dim_a[0] && dim_s[1] == dim_a[1]) {
        //console.log("Old SVD (T) worked");
        return {
          U: correct_U,
          S: Sd,
          V: correct_V
        };
      }
    console.log("A^T failed");
  }
  console.log("Solution 3:");
  var svdt = numeric.svd(numeric.transpose(A));
  var V = svdt.U;
  var U = svdt.V; //var _Sigma_A= svdt.S;

  var svd_ = numeric.svd(numeric.dotMMsmall(numeric.transpose(A), A));
  var proper_V = svd_.U;
  var proper_U = U;
  //var SS=svdt.S;
  //var dima = numeric.dim(A);
  //var maxdim = Math.max(dima[0],dima[1]);
  //numeric.identity(maxdim);
  var SS = numeric['*'](A, 0);
  for (var i in svdt.S)
    SS[i][i] = svdt.S[i];
  r = {};
  r.U = proper_U;
  r.V = proper_V;
  r.S = SS;
  //r.diag = svdt.S; //of length min(m,n)
  //r.diag00 = svdt.S; //r.diag00 = numeric.diag(SS);  //of length min(m,n)?
  //
  return r;
}

function svd_test(A, svd) {
  var almost_eq_s = function (a, b) {
    return Math.abs(a - b) < 0.000001;
  };
  var almost_eq_v = function (a, b) {
    var dif = numeric['-'](a, b);
    return numeric.dotMMsmall(dif, dif) < 0.0001;
  };
  var almost_eq_m = function (a, b) {
    var dif = numeric.abs(numeric['-'](a, b));
    return numeric.sum(dif) < 0.0001;
  };
  var m = numeric.dim(A)[0];
  var n = numeric.dim(A)[1];
  var fails = false;
  fails += (m == numeric.dim(svd.U)[0]) ? 0 : 1;
  fails += (m == numeric.dim(svd.U)[1]) ? 0 : 1;
  fails += (n == numeric.dim(svd.V)[0]) ? 0 : 1;
  fails += (n == numeric.dim(svd.V)[1]) ? 0 : 1;
  fails += (m == numeric.dim(svd.S)[0]) ? 0 : 1;
  fails += (n == numeric.dim(svd.S)[1]) ? 0 : 1;
  var mul = numeric.dotMMsmall;
  fails += (almost_eq_m(A, mul(mul(svd.U, svd.S), svd.V))) ? 0 : 1;
  var pr = numeric.prettyPrint;
  //console.log(pr(svd.diag00));
  if (fails) {
    //It does fail.
    //console.log(fails+" SVD tests failed.");
  } else {
    //console.log("SVD tests passed!");
  }
  return fails;
}

function more_tests() {
  var q1 = [
    [1, -1, 0, 0],
    [0, 0, 1, -1]
  ];
  var s1 = proper_svd(q1);
  var fails = svd_test(q1, s1);
  if (fails) {
    //console.log("Some SVD tests failed: "+fails+" tests failed.");
  }
  /*
  var q2=[[1,-1,0,0]];
  var s2= proper_svd(q2);
  fails = svd_test(q2,s2);
  if(fails)
      console.log("failed "+fails+" tests.");
  var q3=[[1,-1]];
  var s3= proper_svd(q3);
  fails = svd_test(q3,s3);
  if(fails)
      console.log("failed "+fails+" tests.");
  */
}
more_tests();

function test_P() {
  //var union_shape_index_list = ?
  var s = new ConstraintManager(constr2_, mainModel, constraints_dict); // how was it working?
  //s.prepareCompileMatrices();
}

/*
function test_Cons(){
    theConstraint = new ConstraintManager(constr2_, mainModel, []);
    theConstraint.setShapes(["-1","-0"]);
    updateScene(false); //leads to theConstraint.apply();
}
*/

var ConstraintImpossible = function (A, B) {
  this.A = A;
  this.B = B;
};


function optimalLinearProjection(_A, _B) {
  //Bug: If you feed it with identity matrix
  var EPS = 0.0000001;
  var svd = proper_svd(_A);
  svd_test(_A, svd);
  // M =
  //_P = A;

  //var sigma_boolean = numeric.gt(numeric.diag(S), EPS);
  /*var A_rows = _A.length;
  if(A_rows==0)
  	var A_cols = 0;
  else
  	var A_cols = _A[0].length;
  this
  */
  var m = numeric.dim(_A)[0]; //rows
  var n = numeric.dim(_A)[1]; //cols
  var maxdim = Math.max(m, n);
  var mindim = Math.min(m, n);

  var Sigma_P = numeric['*'](numeric.identity(n), 0); //numeric['*'](_A,0); //_Sigma_A.slice(); //clone
  var Sigma_Inv = numeric.transpose(numeric['*'](_A, 0)); //numeric.identity(); //numeric.transpose(_Sigma_A); //_Sigma_A.slice(); //clone
  for (var i = 0; i < n; i++)
    if (i < mindim && svd.S[i][i] > EPS) {
      Sigma_P[i][i] = 0;
      //if(i<mindim)
      Sigma_Inv[i][i] = 1.0 / svd.S[i][i];
    }
  else {
    Sigma_P[i][i] = 1.0;
    if (i < mindim) {
      Sigma_Inv[i][i] = 0.0;
      if (svd.S[i][i] > 0.0)
        console.log("warning: 0<s<EPS: sigma=" + svd.S[i][i]);
    }
  }
  for (i = 0; i < n; i++)
    if (i < mindim && svd.S[i][i] > EPS) {
      //Sigma_P[i][i] = 0;
      Sigma_Inv[i][i] = 1.0 / svd.S[i][i];
    }
  else {
    //Sigma_P[i][i] = 1.0;
    Sigma_Inv[i][i] = 0.0;
    //if (svd.S[i][i]>0.0) console.log("warning: 0<s<EPS: sigma="+svd.S[i][i]);
  }
  //var Sigma_p = numeric.lt(numeric.diag(_Sigma_A), 0.0000001); //S is non-negative
  //Sigma_p=numeric['+'](sigma,0);
  //var Sigma_A_inv = numeric.gt(numeric.diag(S), 0.0000001);
  //Sigma_A_inv=numeric['+'](sigma,0);
  var vconj = numeric.transpose(svd.V); //new numeric.T(svd.V).transjugate();
  var uconj = numeric.transpose(svd.U); //check if this transposes the original U
  /*
    this.P=numeric.dotMMbig(numeric.dotMMbig(V,Sigma_P),vconj);
    this.Q=-numeric.dotMMbig(numeric.dot(numeric.dotMMbig(V,Sigma_Inv),uconj),this.B);
	*/
  var mul = numeric.dotMMsmall;
  var _P = mul(mul(svd.V, Sigma_P), vconj);
  //var pr = function(m){ console.log(numeric.prettyPrint(m))};
  var m1 = mul(svd.V, Sigma_Inv);
  //console.log(numeric.prettyPrint(m1));//pr(m1);
  var m2 = mul(mul(svd.V, Sigma_Inv), uconj);
  //console.log(numeric.prettyPrint(m2)); //pr(m2);
  var m3 = numeric.dotMV(mul(mul(svd.V, Sigma_Inv), uconj), _B);
  //console.log(numeric.prettyPrint(m3)); //pr(m3);

  var _Q = numeric['-'](0, m3);


  console.log("P= " + numeric.prettyPrint(_P));
  console.log("Q= " + numeric.prettyPrint(_Q));

  //console.log(numeric.prettyPrint(  ));
  //this.P=V;//numeric.dotMMbig(numeric.dotMMbig(V,Sigma_P),vconj);
  //this.Q=V;//-numeric.dotMMbig(numeric.dot(numeric.dotMMbig(V,Sigma_Inv),uconj),this.B);

  console.log(numeric.prettyPrint(_A));
  console.log(numeric.prettyPrint(_P));
  console.log(numeric.prettyPrint(_Q));

  //Testing
  var X = numeric.random([n]); //[0,0];
  //var proj = project(r, X); //
  var proj = numeric.add(numeric.dotMV(_P, X), _Q);
  console.log(proj);
  var impl = numeric.add(numeric.dotMV(_A, proj), _B);
  console.log(impl);
  var dif = numeric.abs(numeric['-'](impl, 0));
  if (numeric.sum(dif) < 0.0001)
    console.log("Constraint successful.");
  else {
    console.error("Inconsistency difference (for random input): ", dif);
    //throw new ConstraintImpossible();
  }

  r = {};
  r.P = _P;
  r.Q = _Q;
  return r;
}

function PQproject(r, X) {
  //var X = [0,0];
  var proj = numeric.add(numeric.dotMV(r.P, X), r.Q);
  assert(!numeric.any(numeric.isNaN(proj)));
  assert(numeric.all(numeric.isFinite(proj)));
  //console.log(numeric.prettyPrint(proj));
  assert(X.length == proj.length);
  return proj;
}

/*
function C1(){
};

C1.prototype.getARow = function(){
	return [1,-1];
};
C1.prototype.getB = function(){
	return -0*100;
};
C1.prototype.getAttribList = function(){
	return [[0,"x"],[1,"y"]];
};

var constr1 = new C1();
*/
// attachers.js

//var constr1_ = new C_AttachLocation("x", 60*0, 0,1);
//var constr2_ = [new C_AttachLocation("x", 60, 0,1), new C_AttachLocation("y", 0, 0,1)];

//fr test
var constr2_ = [new C_AttachAngle("ax", 0, 1), new C_AttachAngle("ay", 0, 1), new C_AttachAngle("az", 0, 1)]; //Align Angles

//var constr2_ = [new C_AttachLocation("x", 60*0), 0,1]; //align x
//var constr2_ = [new C_AttachLocation("y", 0), 0,1]; //align y

//var constr2_ = [new C_AttachScale("lsx",2.0, 0,1),new C_AttachScale("lsy",2.0, 0,1),new C_AttachScale("lsz",2.0, 0,1)];
//Works!

// *******************************************
// src/symbol-table.js


/////////////
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

function notifyConstraintChange() {
  //todo: notify the UI to update the view.
  if (theConstraint)
    console.log(theConstraint.getDescriptions());
  else
    console.log("theConstraint: " + theConstraint);

}
//todo: When you select an object, it shows a viual feedback about constraints

//Note: this can be null, and it will disable (skip) all constraint-related functionality.
var theConstraint = null; //Dont use an array.
//todo: a constraint sidebar on right.

function applySimpleConstraints() {
  //Dont call this inside updateScene
  if (theConstraint && !theConstraint.noConstraints()) //must check both
  {
    theConstraint.apply();
    applyConstraints(mainModel.getRoot(), objListFromMeshes(currentMeshes));
    updateScene(false); //noConstraints is checked to avoid unnecessarily calling updateScene()
  }
}


/*
    rename: constr2_  --> highlevel_constraints.
    The CEqFactory.make will geberate it.
    User actions update it. Similar to she Tree, Shape, etc classes.
    OPbjects like C_AttachAngle are like Shape class.


    // rename: CEqFactory.make -->     mainModel.constraints.fromDict()
    // It deals with Linerr ones now.
*/

// todo: an object of type HighLevel Constraints. Same level as Shapes.
// Currently it is stored in constr2_
CEqFactory = {};
CEqFactory.make = function (type, vars, offset, shapes_idx) {
  // console.error(vars.length, type, vars, offset, obj_count);
  // assert(offset == 0);

  if (type == "AttachAngle") {

    assert(shapes_idx.length == 2);
    assert(["ax", "ay", "az"].indexOf(vars[0]) > -1);

    if (vars[0] == "ax") {
      // ...
      return new C_AttachAngle("ax", offset, shapes_idx[0], shapes_idx[1]);
    } else if (vars[0] == "ay") {
      return new C_AttachAngle("ay", offset, shapes_idx[0], shapes_idx[1]);
    } else if (vars[0] == "az") {
      return new C_AttachAngle("az", offset, shapes_idx[0], shapes_idx[1]);
    }

  } else if (type == "AttachLocation") {

    assert(shapes_idx.length == 2);
    assert(vars[0] == vars[1]); // for now
    //assert(vars[0] in ["x", "y", "z"]);
    assert(["x", "y", "z"].indexOf(vars[0]) > -1);
    return new C_AttachLocation(vars[0], offset, shapes_idx[0], shapes_idx[1]);

    // todo: different variables in one equation

  } else if (type == "AttachScale") {

    assert(shapes_idx.length == 2);
    assert(["lsx", "lsy", "lsz"].indexOf(vars[0]) > -1);
    assert(vars[0] == vars[1]); // for now
    var ratio = offset;
    return new C_AttachScale(vars[0], ratio, shapes_idx[0], shapes_idx[1]);

  }
}

//Deprecated. Use InterFace.dancePartners2() instead
// Dance Partners menu.
InterFace.defineConstraint_default = function () {
  console.log("Dance Partners");
  if (objListFromMeshes(currentMeshes).length != 2) {
    popUpAlert("You need to select exactly two primitive objects");
    //todo: a primitive should have x,y,z, ax,ay,az, lx,ly,lz
    //or a few more! (in Version 2)
    return;
  }
  if (!!theConstraint)
    popUpAlert("Warning: Constraint already defined.");
  //var l = targetListFromMeshes(currentMeshes);
  // var shl = objListFromMeshes(currentMeshes);
  var shl_indices = targetListFromMeshes(currentMeshes); // not tested

  //This actually has to be global I think.
  //var constr2_ =
  var constr2__ = [new C_AttachAngle("ax", 0, 1), new C_AttachAngle("ay", 0, 1), new C_AttachAngle("az", 0, 1)]; //Align Angles

  theConstraint = new ConstraintManager(constr2__, mainModel, shl_indices);
  // theConstraint.setShapes([shl[0],shl[1]]);

  //apply right now. fixme: initiate an update process that ends up with updateScene.
  applyConstraints(mainModel.getRoot(), objListFromMeshes(currentMeshes));
  updateScene(false); //leads to theConstraint.apply();
  /*if(theConstraint){
      theConstraint.apply();
      updateScene(false);
  }*/
};

function shapes_from_target_list(target_list, mainModel) {
  // See Action class
  var targetShapes = [];
  for (var i = 0; i < target_list.length; i++) {
    var targetNb = target_list[i];
    var target = mainModel.getRoot().getObjByIndex(targetNb);
    targetShapes.push(target);
  }
  return targetShapes;
}


// mainModel.
function mode_invariant() {
  //shapes have different index es
}


/*
    Constraints the angles of exactly two shapes.
    Use this function to test.
    Select two objects and call this function
    was: InterFace.test_constr()
*/
InterFace.dancePartners2 = function () {

  console.log("Dance Partners");

  if (objListFromMeshes(currentMeshes).length != 2) {
    popUpAlert("You need to select exactly two shapes");
    //todo: a primitive should have x,y,z, ax,ay,az, lx,ly,lz
    //or a few more! (in Version 2)
    return;
  }
  /*
  var q = {
      clines:  // constraints:
      [
          indices: [
              currentMeshes[0].parentShape.index,
              currentMeshes[1].parentShape.index
          ],
          eq: ""
      ],
  };
  */

  /*
  var q = {
      constraints:
      [
          // in principle can be any number.
          obj1: currentMeshes[0].parentShape.index,
          obj2: currentMeshes[1].parentShape.index,
          type: "AttachAngle",
          var1: "ax",
          offset: 0,
      ],
  };
  */

  var q = //{
    //constraints:
    [

      {
        // in principle can be any number.
        shapes_idx: [currentMeshes[0].parentShape.index, currentMeshes[1].parentShape.index],
        type: "AttachAngle",
        vars: ["ax", "ax"],
        offset: 0, //delta?
      },
      {
        shapes_idx: [currentMeshes[0].parentShape.index, currentMeshes[1].parentShape.index],
        type: "AttachAngle",
        vars: ["ay", "ay"],
        offset: 0,
      },
      {
        shapes_idx: [currentMeshes[0].parentShape.index, currentMeshes[1].parentShape.index],
        type: "AttachAngle",
        vars: ["az", "az"],
        offset: 0,
      },

      /*
      {
          shapes_idx: [currentMeshes[0].parentShape.index, currentMeshes[1].parentShape.index],
          type: "AttachScale",
          vars: ["lsx", "lsx"],
          ratio: 2,
      }
      */
      //
    ];
  //}
  console.info(q);

  _defineConstraintFromJSON(JSON.stringify(q));
}


function _repeat_string(str, count) {
  var list = [];
  for (var i = 0; i < count; ++i) {
    list.push(str);
  }
  return list;
}

/**
 * Implicit argument: currentMeshes
 */
InterFace.dancePartnersMultiple = function () {

  console.log("Dance Partners");

  if (objListFromMeshes(currentMeshes).length < 2) {
    popUpAlert("You need to select at least two pieces"); // at least
    return;
  }
  var shape_index_list = []
  for (var i = 0; i < currentMeshes.length; ++i) {
    shape_index_list.push(currentMeshes[i].parentShape.index);
  }
  // shape_index_list : [shape_index_list[0], shape_index_list[1]]


  var count = shape_index_list.length;

  /*
  var constr_dict =
      [
          {
              // in principle can be any number.
              shapes_idx: shape_index_list,
              type: "AttachAngle",
              vars: _repeat_string("ax", count),
              offset: 0, //delta?
          },
          {
              shapes_idx: shape_index_list,
              type: "AttachAngle",
              vars: _repeat_string("ay", count),
              offset: 0,
          },
          {
              shapes_idx: shape_index_list,
              type: "AttachAngle",
              vars: _repeat_string("az", count),
              offset: 0,
          },
      ];
  */
  var constr_dict = [];
  for (var pi = 0; pi < count - 1; ++pi) {
    var allvars = ["ax", "ay", "az"];
    for (var vi = 0; vi < allvars.length; ++vi) {
      constr_dict.push({
        shapes_idx: [shape_index_list[pi], shape_index_list[pi + 1]],
        type: "AttachAngle",
        vars: _repeat_string(allvars[vi], 2),
        offset: 0,
      });
    }
  }

  console.info(constr_dict);

  _defineConstraintFromJSON(JSON.stringify(constr_dict));
}


/** Displacement constraint */
InterFace.constraint_samedistance = function () {

  if (objListFromMeshes(currentMeshes).length < 2) {
    popUpAlert("You need to select at least two pieces"); // at least
    return;
  }
  var shape3d_list = []
  for (var i = 0; i < currentMeshes.length; ++i) {
    shape3d_list.push(currentMeshes[i].parentShape);
  }
  var shape_index_list = []
  for (var i = 0; i < currentMeshes.length; ++i) {
    shape_index_list.push(currentMeshes[i].parentShape.index);
  }


  var count = shape_index_list.length;

  var constr_dict = [];
  for (var pi = 0; pi < count - 1; ++pi) {
    var allvars = ["x"]; // ["x", "y", "z"];
    for (var vi = 0; vi < allvars.length; ++vi) {
      var sh1 = shape_index_list[pi];
      var sh2 = shape_index_list[pi + 1];
      var vars = _repeat_string(allvars[vi], 2);
      var diff_x = getShapeProperties(shape3d_list[pi], vars[0]) - getShapeProperties(shape3d_list[pi + 1], vars[1]);
      constr_dict.push({
        shapes_idx: [sh1, sh2],
        type: "AttachLocation",
        vars: vars, // todo: read multiple
        offset: -diff_x,
      });
    }
  }

  console.info(constr_dict);

  _defineConstraintFromJSON(JSON.stringify(constr_dict));
}


// var global_objs_temporary = [];

/**
 * Turns a (JSONable) dictionary into class/object structure (model) for constraint system: i.e. A list of equations.
 * It also sets the list of shapes involved, as a list of index values (integers).
 *
 * @param      {list}  A list of dictionaries, containing specifications of the whole constrains structure.
 * @return     {list}   The list of Equations.
 */
function constr_from_dict(constraints_dict) {

  // var total_shapeindexlist_involved = [];
  // // var global_objs_temporary;

  // var constr_list = [];
  // for(var i=0;i<constraints_dict.length; i++) {
  //     var shapes_idx = constraints_dict[i].shapes_idx;
  //     /*var type = constraints_dict[i].type;
  //     var vars = constraints_dict[i].vars;
  //     var offset = constraints_dict[i].offset;
  //     if(type=="AttachScale"){
  //         offset = constraints_dict[i].ratio;
  //     }
  //     */

  //     //var _shapes_involved = shapes_from_target_list( shapes_idx, mainModel );
  //     //global_objs_temporary = _shapes_involved;

  //     // Will not be really used (?)
  //     // Union the actual shape indices objects, not indices.
  //     var _shapes_involved = shapes_idx;
  //     for (var i=0; i < _shapes_involved.length; ++i) {
  //         if (total_shapeindexlist_involved.indexOf(_shapes_involved[i]) == -1) {
  //             total_shapeindexlist_involved.push(_shapes_involved[i]);
  //         }
  //     }
  // }
  var total_shapeindexlist_involved = "NO";

  var constr_list = [];
  for (var i = 0; i < constraints_dict.length; i++) {
    var shapes_idx = constraints_dict[i].shapes_idx;
    var type = constraints_dict[i].type;
    var vars = constraints_dict[i].vars;
    var offset = constraints_dict[i].offset;
    if (type == "AttachScale") {
      offset = constraints_dict[i].ratio;
    }

    /*
     *  todo: correspondence for CEqFactory.make()
     */
    // shapes_idx is ignored now
    //var obj_count = _shapes_involved.length;
    //assert(obj_count == 2);
    // generates an Equation object based on JSON
    var c = CEqFactory.make(type, vars, offset, shapes_idx);

    constr_list.push(c);
  }
  // shapes_involved = _shapes_involved;
  console.error(total_shapeindexlist_involved);
  console.error(constr_list);

  return {
    constr_list: constr_list,
    total_shapes_involved: total_shapeindexlist_involved
  };
}

// Low level. was: defineConstraint
var _defineConstraintFromJSON = function (constraintsJson) {
  console.info("Setting the constraint: ", constraintsJson);

  if (!!theConstraint)
    popUpAlert("Warning: Constraint already defined.");

  var constraints_dict = JSON.parse(constraintsJson);
  // constraints_dict.shape_indices
  // constraints_dict.clines  = a list: each elements is one line of a linear equation.

  //var l = targetListFromMeshes(currentMeshes);
  //var shl = objListFromMeshes(currentMeshes);
  // shl will be a list of Shape objects.
  //var shl = shapes_from_target_list( constraints_dict.shape_indices, mainModel );

  /*    var shapes_involved = shapes_from_target_list( constraints_dict.shape_indices, mainModel );
  console.error(shapes_involved);
  return;
  */
  //var shl = shapes_involved


  // constr2_ will be a list of constaint variables
  //var constr2_ = [new C_AttachAngle("ax", 0,1), new C_AttachAngle("ay", 0,1), new C_AttachAngle("az", 0,1)]; //Align Angles

  //This actually has to be global I think.
  //var constr2_ =
  //constr2_ =
  //    [new C_AttachAngle("ax", 0,1), new C_AttachAngle("ay", 0,1), new C_AttachAngle("az", 0,1)]; //Align Angles
  //constr2_ = constr_list;

  /*
  constr_list = [];
  for (var i=0; i< constraints_dict.clines.length; i++) {
      var CEq_dict = constraints_dict.clines[i];

      // returns a value like new C_AttachAngle("ax", 0,1):
      var cl = cline_to_CEq(CEq_dict);
      constr_list.push( cl );
  }*/

  var constrModel = constr_from_dict(constraints_dict);
  var constr_list = constrModel.constr_list;
  //todo: move constr2_ into mainModel
  var global_objs_temporary = constrModel.total_shapes_involved;
  assert(global_objs_temporary.length == 2);

  //theConstraint = new ConstraintManager(constr2_, mainModel, union_shape_index_list);
  // constr2_ = constr_list;
  // var shape_index_list = [global_objs_temporary[0], global_objs_temporary[1]];
  var shape_index_list = global_objs_temporary;
  var union_shape_index_list = constrModel.total_shapes_involved;
  console.info("union_shape_index_list", union_shape_index_list);

  // global
  theConstraint = new ConstraintManager(constr_list, mainModel);
  // theConstraint.setShapes([global_objs_temporary[0], global_objs_temporary[1]]);

  //todo: more shapes
  //theConstraint.setShapes([total_shapes_involved[0], total_shapes_involved[1]]);

  //apply right now. fixme: initiate an update process that ends up with updateScene.
  applyConstraints(mainModel.getRoot(), objListFromMeshes(currentMeshes));
  updateScene(false); //leads to theConstraint.apply();
  /*if(theConstraint){
      theConstraint.apply();
      updateScene(false);
  }*/
};


// API
var CONSTRAINTS = {};
CONSTRAINTS.defineConstraintFromJSON = _defineConstraintFromJSON; // defineConstraint()  setFromJSON


var getShapesFromIndlList = function (target) {
  var targetShapes = [];
  for (var i = 0; i < target.length; i++) {
    targetNb = target[i].split("-");
    targetShapes.push(getTreeObj(targetNb));
  }
  console.error(targetShapes);
  return targetShapes;
};

//function getFirstMeshAboveShape(shape){} //<- for highlight
//function forcedGetMesh(shape){} //<- gets a mesh for displayand adds it to the scene if it does not extst. but it is not clickable.  //<-for highlighting

/*
//XYZSSSAAA system where AAA is EulerXYZ
getShapeProperty = function(shape, attrib){
    switch(attrib){
        case 'x': return shape.center.x;
        case 'y': return shape.center.y;
        case 'z': return shape.center.z;
        case 'w': return shape.getLength(); //see getDimsAndCenterOfSelectedObject()
        case 'l': return shape.getWidth();
        case 'h': return shape.getHeight();
        case 'ax':
        case 'ay':
        case 'az':
        default: console.error("Unrecognised switch case.");
    }
}
*/
//Three methods: attribute name,

var _getShapeProperties = function (shape) {
  var d = decomposeMatrix(shape.matrix);
  //d: {translation: Vector3D, scale: Vector3D, rotation: Vector3D}
  return [
    d.translation.x,
    d.translation.y,
    d.translation.z,
    d.scale.x,
    d.scale.y,
    d.scale.z,
    d.rotation.x,
    d.rotation.y,
    d.rotation.z,
  ];
  /*
  return [
      shape.center.x, shape.center.y, shape.center.z,
      shape.getLength(), shape.getWidth(), shape.getHeight(),
      shape.angle.x, shape.angle.y, shape.angle.z];
  */
  //see getDimsAndCenterOfSelectedObject()
};
var getShapeProperties = function (shape, attrib) {
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
var setShapeProperties = function (shape, attrib, value) {
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

/*
setSizeX(){
//currentMeshes[0].parentShape.resizeLength(xs);
}
*/

//being primitive means has x,y,z. This should include the "complex primitive" objects.
//not tested
function isPrimitive(shape) {
  if (!shape.sons)
    return true;
  if (shape.sons.length === 0)
    return true;
  if (shape.lock)
    return true;
  return false;
}
//move near isShapeMesh

function setPrimitiveAngles(shape, ax, ay, az) {
  assert(isPrimitive(shape));
  //currentMeshes[0].parentShape
  console.warn("unclean solution for rotation");
  var ang = shape.angle;
  var delta_ax = ax - ang.x;
  var delta_ay = ay - ang.y;
  var delta_az = az - ang.z;
  Api.rotate(delta_ax, delta_ay, delta_az, objListFromMeshes(currentMeshes));
}