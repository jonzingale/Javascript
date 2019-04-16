module Epidemics where

{--
The goal here is to explore an SIR network model
in terms of Linear Algebra.

* Adjacency Matrix
* I, S vectors
* Tensor product?
--}

-- outer product of two vectors.
(*:) :: Num a => [a] -> [a] -> [a]
(*:) x y = (*) <$> x <*> y

-- inner product of two vectors.
(|:) :: Num a => [a] -> [a] -> [a]
(|:) x y = zipWith (*) x y

-- apply linear transformation.
-- (|.) :: Num a => [[a]] -> [a] -> [a]
(|.) m a =  map (foldr (+) 0) $ map ((|:) i) a

a = [[0,1,0,1,0],
     [1,0,1,1,0],
     [0,1,0,0,0],
     [1,1,0,0,1],
     [0,0,0,1,0]]

i = [1,0,1,0,0]
s = [0,1,0,0,1]
