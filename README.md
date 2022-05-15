# 3dconstraints.js

A set of classes and functions to define constrains between 3d objects.
Enables manipulating objects while they stay synced.

When a constrainas is defined between two objecs any ofo them caan be manipulted, and it reflects on the other.
There is no directionality.

The constrians are very general. They are linear, but they can some nooninearity. 

Suitable for web-based interactive 3d editing software.

Written in vanilla JavaScript with no dependency to external libraaries.

Each 3d object has a "shape", a free 3x4 matrix for as a lineaar transformation matrix.

### Video dmostation (comoing soon)

### How it works
As aa result of adding (multile) constraints, a set of linear equtions is ccreated and is solved on the fly.
A constriant is a projection into the null-space of a transformation associated with the current set of equations.

`constr_dict`

## Usage
*   `_defineConstraintFromJSON( JSON.stringify(constr_dict) );`
*   
### The interface
* The `InterFace` class
* `InterFace.constraint_samedistance`
* `InterFace.dancePartnersMultiple`
* `InterFace.dancePartners2`
* `InterFace.defineConstraint_default` (deprecated)

*  `applySimpleConstraints()`

* `_defineConstraintFromJSON()`
* 
* `ConstraintManager` class:
  * `apply()`
  * `new ConstraintManager(constr2, mainModel)`
  
### Internals:
* `CSymbolTable`
* `optimalLinearProjection`
* `getShapeProperties`
* `setShapeProperties`

## History
Written back in 2016, it is using prototype-based OOP (pre- ECMAScript 2015) to be able to run on browsers at the time.

Keywords: Linear Algebra, SVD, 3D, affine
