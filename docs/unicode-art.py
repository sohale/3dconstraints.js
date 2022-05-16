import sympy
from sympy import *

A = sympy.Matrix([
  [ +1 , 0 , -1 ,0 , 0],
  [ 0 ,+1 , -1 ,0 , 0 ],
  [ 0 , 0 , 0 , 1 , -1],
])

sympy.pprint(A, use_unicode=True)

b = sympy.Matrix([ 10.0, 5.0, sympy.simplify(log(0.4, 10.0))])
sympy.pprint(b.T, use_unicode=True)

[x0,	y0,	x1,	lsx0,	lsy0] = symbols("x0	y0	x1	lsx0	lsy0")
x=sympy.Matrix([x0,	y0,	x1,	lsx0,	lsy0])
sympy.pprint(x, use_unicode=True)
sympy.pprint(A *x, use_unicode=True)
eq = Eq(A *x , b)
sympy.pprint(eq, use_unicode=True)
