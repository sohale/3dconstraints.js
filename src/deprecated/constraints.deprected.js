'use strict';
//This is was a draft early version. To implement it, start from a clean new js file.
//function Constraints(){}

function SymbolTable(tree){
    //this.tree = tree; //no!
    //Immutable!
}

SymbolTable.properties.lookupShapeByName = function(tree, shapeName)
{// i.e. parseShapeName
    return shapeObj;
    throw "Shape with name "+shapeName+" not found";
}
SymbolTable.properties.getShapeName = function(tree, shapeObj)
{
    return name;
    throw "Shape not found in tree";
}
function parseAttribute(tree, fullAttribName)
{
    //parseName
    var li = fullAttribName.lastIndexOf(".");
    var attrib = fullAttribName.substring(li+1);
    assert(attrib.length()>0);
    var shapename = fullAttribName.substring(0,li);
    assert(shapename.length()>0);
    var shapeObj = lookupShapeByName(shapename);
    return [shapeObj,attrib];
}

function traverseTreeAttributes(_root, callBack)
{
    //callBack(shapeObj,attribute)
    assert(!_root);
    if(_root typeof(_root) == "Shape blah blah"){
        callBack(shapeObj, "x");
        callBack(shapeObj, "y");
        callBack(shapeObj, "z");
        callBack(shapeObj, "h");
        callBack(shapeObj, "w");
        callBack(shapeObj, "l");
        callBack(shapeObj, "ax");
        callBack(shapeObj, "ay");
        callBack(shapeObj, "az");
    }
    else
        for (var i=0;i<_root.sons;i++)
            traverseTreeAttributes(_root.sons[i],callBack);
}

SymbolTable.properties.getShapeAttribIndex =function(tree, fullAttribName)
{
    var atr = parseAttribute(tree, fullAttribName);
    atr[0]
    atr[1]

    return i;
    throw "Shape with name "+name+" not found";
    throw "Invalide attribute "+attrib;
}

SymbolTable.properties.getAttribValue = function(tree, fullAttribName)
{//slow
    var atr = parseAttribute(tree, fullAttribName)
    return 0.0;
    throw "Shape with name "+name+" not found";
}
SymbolTable.properties.setAttribValue = function(tree, fullAttribName, value)
{ //slow
    //parseName
}
SymbolTable.properties.getAttribValue = function(idx)
{//fast
    var shape = this.shapes[i]; //no need to have this.tree
    assert( getName(idx) == ...);
    return shape. ...;
}
SymbolTable.properties.setAttribValue = function(idx, value)
{//fast
    this.shapes[i].?? = value;
}

SymbolTable.properties.rename = function(tree, oldname, newname)
{
    throw "Shape with name "+name+" not found";
}
/*
SymbolTable.properties.reorder = function(tree, oldIdx, newIdx)
{
    if(oldIdx==-1)
        ;//create a new index
    else {
        ...
    }
}
*/
//What happens when you add a new object, or delete an object? All symbols are reordered. The same is for Equations. Solution: Represent the equaiotns based on their names.
SymbolTable.properties.getDimentions = function()
{
    return this.symbols.length;
}

//a constrnt is a list of equations
DeleteShapeObj(symboleTable,constrnt, name){

}
RecreateShapeObj(symboleTable,constrnt, json1,json2){
}


function SingleEquation(symbolTable)
{
    this.terms = []; //terms are added
}
SingleEquation.prototype.evaluateConstraint = function(xvec)// rename:EvaluateEquation
{
    var val = 0.0;
    for(var i =0; i<this.terms.length; i++)
        val += 0.0;
    return val;
}
SingleEquation.prototype.gradient = function(xvec)
{
    return vect;
}
SingleEquation.prototype.evaluateTerm = function(idx, vec)
{
    var term = this.terms[idx];
    var val = 1.0;
    for(var i=0; i<term.length; i++){
        var varIdx = term[i*2];
        var pow = term[i*2+1];
        val *= vec[varIdx];
    }
    return val;
}
SingleEquation.prototype.evaluateTerm = function(idx, vec, baseVariable)
{
    var term = this.terms[idx];
    var val = 1.0;
    for(var i=0; i<term.length; i++)
        val *= vec[term[i]];
    return val;
}

function evaluateEquationSet(listOfEquations, x)
{
    ;
}
function evaluateJacobianEquationSet(listOfEquations, x)
{
    ;
}



function SolveEquationSetNoSymboleTable(listOfEquations, start)
{
    //no need for symboleTable really
}
//Also see: http://www.numericjs.com/documentation.html
function SolveEquationSet(listOfEquations, symboleTable, start)
{
    if (listOfEquations.length==0)
        return start;
    var x = start;
    assert(typeof(listOfEquations[0])=="SingleEquation");

    while(true)
    {
        var g = this.gradient(x);
        for(var i=0;i<listOfEquations.length;i++){
            ;
            ?var val = this.evaluateConstraint();
            //Use Newton's method
            var jacobian = evaluateJacobian(...);
            //tryy new verctor , and newvetor/2. get the smaller.
        }
        error = Math.abs(?????);
    }
}


function Constraint(json)
{
}
function Constraint.prototype.toJson()
{

}
function Constraint.fromJson() //factory method
{

}
/*no!
function Constraint.prototype.constrain(tree, old_state, new_state, new_equation)
*/

function Constraint.prototype.constrain(tree_with_old_state, new_equation)
{
    //may throw an exception:
    //not found (impossible)
    //not converged
    //or a real answer (A vector). //Then it (or the next method) applies the answer..
    //The new_equation deines the "change"
}

//Constaint.rototype.addVariable(){
//adds an extra variable
//}
