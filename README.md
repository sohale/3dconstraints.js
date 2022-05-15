# 3dconstraints.js

A set of classes and functions to define constrains between 3d objects.
Enables manipulating objects while they stay synced. Fast and flexible.

When a constrainas is defined between two objecs any of them can be manipulted, and it reflects on the other.
There is no order or "directionality". The objects are somehow magically ✨ synced simultaneously, and symultanous with other constriants between all objects that participate in binding constraints in a 3d scene.

The constrians are very general. They are linear, but they can some nooninearity.

Suitable for web-based interactive 3d editing software. Originally written for ThreeJS-based software. [^1]

Each 3d object has a "shape", a free 3x4 matrix for as a lineaar transformation matrix.

Written in vanilla JavaScript.. The only library used is `numericjs`.

Dependencies:
* [`numeric-1.2.6.js`](http://www.numericjs.com/lib/numeric-1.2.6.js)
* Suggested [cdn](https://cdnjs.cloudflare.com/ajax/libs/numeric/1.2.6/numeric.min.js).
* ThreeJS r79+ (not a dependency, but recommended)

### Video demonstration (coming soon)

### How it works
As a result of adding (multile) constraints, a set of linear equtions is ccreated and is solved on the fly.
A constriant is a projection into the null-space of a transformation associated with the current set of equations.

`constr_dict`

Example constraint set:
A constraint set is a set of reuqaions (lines) eaach define a free-form linear reltionship between aattriutes. Note that the constrians may not be linear, eg in cse where the Eulerian angles aare constrained.
`obj0.x - obj1.x = delta_x`
`obj0.y - obj1.x = delta2`

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
