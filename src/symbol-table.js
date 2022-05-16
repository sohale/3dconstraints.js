'use strict';

function CSymbolTable(constr2, unique_bigindices_list) {
  this.makeSymboleTable(constr2, unique_bigindices_list);
}

/**
 * Used internally (private member). Called by makeSymboleTable().
 * Adds a symbol for the given (shape,attribName) tuple.
 * @param      {list}  attrib  An attrib is a pair of [shape_symbolIndex, attribName]
 * A symbol is identified by a unique symboleIndex.
 * A shape_symbolIndex is the index of the shape in an internal index.
 * Each shape is identified by a shape_symbolIndex, which is not the symboleIndex, and neighther the shape's index.
 * The correspondence is kept in the ConstraintManager (it's unintuitive).
 * Union of symbols, not shapes.
 */
CSymbolTable.prototype.addSymbol = function (small_index, attribName, big_index) {
  var symbolAlreadyExists = 0;
  for (var j = 0; j < this.s.length; j++) {
    if (this.s[j][1] == attribName && this.s[j][2] == big_index)
      symbolAlreadyExists++;
  }

  if (!symbolAlreadyExists) {
    //console.info([small_index, attribName] );
    var small_index = // this.s.length;  // last item + 1
      this.s.push([small_index, attribName, big_index]);
  } else {
    assert(symbolAlreadyExists == 1);
  }
};

/*
CSymbolTable.prototype.getSymbolIndex = function(small_index?, attribName) {
}
*/

CSymbolTable.prototype.getEquationIndex = function (small_index, attribName)
//an attrib is a pair of [Shape, attribName]
{
  for (var j = 0; j < this.s.length; j++) {
    // console.info(this.s[j], "against", [small_index, attribName] );
    if (this.s[j][0] == small_index && this.s[j][1] == attribName)
      return j;
  }
  throw "Mathcing attribute not found [" + small_index + "," + attribName + "]";
};
/**
 * A binding (to an object), is a variable in the equations.
 * Each attribute is a symbole, i.e. like smallindex."ax"
 * = this.s[idx]
 * @return     {list}  { [small_index, attibute_name, big_index] }
 */
CSymbolTable.prototype.lookupAttrib = function (idx) {
  //assertions
  assert(idx >= 0);
  assert(idx < this.s.length);
  var test_shp = this.s[idx][0];
  var test_attrib = this.s[idx][1];

  return this.s[idx]; ////an attrib is a pair of [Shape, attribName]
};

CSymbolTable.prototype.getAttribCount = function () {
  return this.s.length;
};
CSymbolTable.prototype.make_bigsmall_lookup = function (unique_indices_list) {
  // gets an indexing based on the map
  // unique_indices_list is already small->big_lookup
  var bigsmall_lookup = {};
  var ctr = 0;
  for (var i = 0; i < unique_indices_list.length; ++i) {
    var big = unique_indices_list[i];
    _expect(!bigsmall_lookup[big], big, "unique_indices_list should not have repeated elements");
    bigsmall_lookup[big] = ctr;
    ++ctr;
  }
  return bigsmall_lookup;
}

/**
 * Makes this.s, the array of symbols (tuples of: sindex,attrname,bindex). It will not be changed later.
 * Called by the constructor.
 * Calls addSymbol()
 *
 * @param      {list}  constr2  is a list of constraint objects (mainModel level)
 */
CSymbolTable.prototype.makeSymboleTable = function (constr2, unique_bigindices_list) {

  var bigsmall_lookup = this.make_bigsmall_lookup(unique_bigindices_list);

  this.s = [];
  for (var i = 0; i < constr2.length; i++) {
    //console.log(i);
    var constr_1 = constr2[i];
    var a1 = constr_1.getAttribs();
    for (var j = 0; j < a1.length; j++) {
      var tuple = a1[j]; // todo: make this a dict {shapeindex:, attrib:, shape_symbol_index:}

      var attribName = tuple[1]; // 'x', 'ax', 'lz', etc
      var shape_big_index = tuple[0]; // The same "shape index" used for collaboration sync. big index.
      // var shape3d = shape3d_lookup************
      //var shape_symbolIndex = shape_index_lookup_table[shape_index ];
      //this.addSymbol(shape_symbolIndex, attribName, big_index);
      var small_index = bigsmall_lookup[shape_big_index];
      _expect(small_index !== undefined);
      this.addSymbol(small_index, attribName, shape_big_index); // small index is created here
      assert(this.s.length < 100);
    }
  }
  //remove repeated ones
  //console.log(a);//numeric.prettyPrint(a));
  //return a;
};

CSymbolTable.prototype.setVFromShapes = function (total_shape3d_list, v) {
  /*
  var sh = getShapesFromIndlList(shapes);
  for(var i=0;i<this.s.length;i++){
      var small_idx= this.s[i][0];
      var attrib_name = this.s[i][1];
      v[i] = getShapeAttribute(sh[small_idx],attrib_name);
  }
  assert(v.length == this.getAttribList().length);
  */
  //var sh = getShapesFromIndlList(shapes);

  for (var vari = 0; vari < this.getAttribCount(); vari++) {
    var attr = this.lookupAttrib(vari);
    var small_idx = attr[0]; // small index
    var attr_name = attr[1];
    var big_index = attr[2]; // ont used
    /*
    //var shape3d = total_shape3d_list[small_idx];
    var sh_index = attr[0];
    var shape3d = this.shape3d_lookup[sh_index];
    _expect(shape3d, "No Shape3d with this index", sh_index);
    */
    var shape3d = total_shape3d_list[small_idx];
    v[vari] = getShapeAttribute(shape3d, attr_name);
  }
};
CSymbolTable.prototype.setShapesFromV = function (total_shape3d_list, v) {
  //todo: move shapes to this
  //var sh = getShapesFromIndlList(shapes); //sh = Indl indices
  /*
  //var a=this.getAttribList(); ****
  var ctr=0;
  for(var i=0;i<this.s.length;i++){
      var small_idx= this.s[i][0];
      var attrib_name = this.s[i][1];
      if(!(ctr<v.length))
          console.log("oh no");
      assert(ctr<v.length);
      applyShapeAttribute(sh[small_idx], attrib_name, v[ctr]);
      ctr++;
  }
  */

  for (var vari = 0; vari < this.getAttribCount(); vari++) {
    var attr = this.lookupAttrib(vari);
    var small_idx = attr[0]; // small index
    var attr_name = attr[1];
    applyShapeAttribute(total_shape3d_list[small_idx], attr_name, v[vari]);
  }
};
