# 3dconstraints.js

A set of classes and functions to define constrains between 3d objects.
Enables manipulating objects while they stay synced.

When a constrainas is defined between two objecs any ofo them caan be manipulted, and it reflects on the other.
There is no directionality.

The constrians are very general. They are linear, but they can some nooninearity. 

Suitable for web-based interactive 3d editing software.

Written in vanilla JavaScript with no dependency to external libraaries.

Each 3d object has a "shape", a free 3x4 matrix for as a lineaar transformation matrix.

### The interface
* The `InterFace` class
* `InterFace.constraint_samedistance`
* `InterFace.dancePartnersMultiple`
* `InterFace.dancePartners2`
* `InterFace.defineConstraint_default` (deprecated)

*  `applySimpleConstraints()`

* `ConstraintManager` class:
  * `apply()`
  * `new ConstraintManager(constr2, mainModel)`
  
### Internals:
* `CSymbolTable`
* `optimalLinearProjection`
* getShapeProperties 
* setShapeProperties 

## History
Written back in 2016, it is using prototype-based OOP (pre- ECMAScript 2015) to be able to run on browsers at the time.

Keywords: Linear Algebra, SVD, 3D, affine
