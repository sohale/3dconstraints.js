'use strict';

// excerpt

function applyConstraints(tree, listOfShapes)
{
    _expect(tree == mainModel.getRoot());
    var constraintDims = CONFIG.printer.printer_strict_bounds;
    updateRoot();
    if(theConstraint) {
        theConstraint.apply();
    }

	for (var i in tree.sons)
	{
	var obj = tree.sons[i];
        var bbox = obj.getBoundingBox_(false);
        /*var obj_min = [bbox.min.x, bbox.min.y, bbox.min.z];
        var obj_max = [bbox.max.x, bbox.max.y, bbox.max.z];*/
        var obj_min = bbox.min;
        var obj_max = bbox.max;

		var tv = new Vector3D(0, 0, 0);
		var diff;
		for (var dim in constraintDims.min)
		{
			diff = obj_min[dim] - constraintDims.min[dim];
			if (diff < 0)
			{
				if (dim=="x") tv.x = -diff;
				if (dim=="y") tv.y = -diff;
				if (dim=="z") tv.z = -diff;
			}
		}
		for (dim in constraintDims.max)
		{
			diff = obj_max[dim] - constraintDims.max[dim];
			if (diff > 0)
			{
				if (dim=="x") tv.x = -diff;
				if (dim=="y") tv.y = -diff;
				if (dim=="z") tv.z = -diff;
			}
		}

		if (listOfShapes.indexOf(obj) != -1)
		{
			ObjGroup.translateGroup(listOfShapes, tv.x, tv.y, tv.z, true);
		}
		else
		{
			ObjGroup.translateGroup([obj], tv.x, tv.y, tv.z, true);
		}
	}
}


function removeSelected()
{

    if(theConstraint) {
        theConstraint.removeAllInvolvedConstraints( objListFromMeshes(currentMeshes) );
    }
    // ...
}
