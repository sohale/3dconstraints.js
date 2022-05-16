'use strict';
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
// src/constraint-manager.js


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
      var diff_x = getShapeAttribute(shape3d_list[pi], vars[0]) - getShapeAttribute(shape3d_list[pi + 1], vars[1]);
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


// src/shape-attribute-interface.js


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