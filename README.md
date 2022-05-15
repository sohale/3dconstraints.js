# 3dconstraints.js

A set of classes and functions to define constrains between 3d objects.
Enables manipulating objects while they stay synced. Fast and flexible.

When a constrainas is defined between two objecs any ofo them caan be manipulted, and it reflects on the other.
There is no directionality.

The constrians are very general. They are linear, but they can some nooninearity. 

Suitable for web-based interactive 3d editing software. Originally written for ThreeJS. [^1]

Written in vanilla JavaScript with no dependency to external libraaries.

Each 3d object has a "shape", a free 3x4 matrix for as a lineaar transformation matrix.

### Video dmostation (comoing soon)

### How it works
As a result of adding (multile) constraints, a set of linear equtions is ccreated and is solved on the fly.
A constriant is a projection into the null-space of a transformation associated with the current set of equations.

`constr_dict`

## Usage
Example usage:
*   `CONSTRAINTS.defineConstraintFromJSON(JSON.stringify(constr_dict))`
```
function applySimpleConstraints(){
    if(theConstraint && !theConstraint.noConstraints()) //must check both
    {
        theConstraint.apply();
        applyConstraints(mainModel.getRoot(),objListFromMeshes(currentMeshes));
        // updateScene(false)
    }
}
```
### The API interface
* The `CONSTRAINTS` API
  * method: `.defineConstraintFromJSON()`

* The `InterFace` API
  * `.constraint_samedistance()`
  * `.dancePartnersMultiple()`
  * `.dancePartners2()`
  * `.defineConstraint_default()` (deprecated)
#### Constraints classes
Each fo the following define objects that attache attributes (locations,etc) between two given objects:
* `C_AttachLocation` : Attaches location: X ⃗1 = X ⃗2 + d ⃗ . Imposes a relative position d ⃗
* `C_AttachAngle` Attaches angles: Attaaches Euler's angles (θ,φ)
* `C_AttachScale` Attaches the scale aspects of the natrices
* `C3_AttachY` (deprecated)

* `CSymbolTable`
*  `applySimpleConstraints()`

* `ConstraintManager` class:
  * `apply()`
  * `new ConstraintManager(constr2, mainModel)`

The DSL:
* Attibutes:
`x`
`y`
`z`
`sx`
`sy`
`sz`
`ax`
`ay`
`az`
`lsx`
`lsy`
`lsz`
`m0`
`m1`
`m2`
`m3`
`m4`
`m5`
`m6`
`m7`
`m8`
`m9`
`m10`
`m11`

### Internals:
* `CSymbolTable`
* `optimalLinearProjection`
* `getShapeProperties`
* `setShapeProperties`

## History
Written back in 2016, it is using prototype-based OOP (pre- ECMAScript 2015) to be able to run on browsers at the time.

## Keywords
Linear Algebra, SVD, 3D, affine, threejs
## References
[^1] https://threejs.org/docs/#api/en/math/Matrix4
[^2] https://github.com/mrdoob/three.js/
