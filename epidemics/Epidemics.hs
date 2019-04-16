{-# OPTIONS_GHC -fno-warn-missing-methods #-}
module Epidemics where
import Data.List (transpose, intersperse)

{--
Write a linear algebraic SIR network model
--}

abc = M [V [1,2], V [3,4]]
xyz = M [V [5,6], V [7,8]]

a = M [V [0,1,0,1,0],
       V [1,0,1,1,0],
       V [0,1,0,0,0],
       V [1,1,0,0,1],
       V [0,0,0,1,0]]

i = V [1,0,1,0,0]
s = V [0,1,0,0,1]

data Matx a = M [Vect a]
data Vect a = V [a]

instance Show a => Show (Vect a) where
    show (V xs) = show xs ++ "\n"

instance Show a => Show (Matx a) where
    show (M a) = foldr ((++).show) "" a

uV :: Vect a -> [a]
uV (V a) = a

uM :: Matx a -> [Vect a]
uM (M a) = a

instance (Num a) => Num (Vect a) where
  (+) (V v) (V w) = V $ zipWith (+) v w
  (-) (V v) (V w) = V $ zipWith (-) v w
  (*) (V v) (V w) = V $ zipWith (*) v w

-- transpose.
tr :: Matx a -> Matx a
tr (M ws') = let ws = map uV ws' in
    M . (map V) . transpose $ ws

-- outer product of two vectors.
(*:) :: Num a => Vect a -> Vect a -> Vect a
(*:) (V x) (V y) = V $ (*) <$> x <*> y

-- apply linear transformation.
(|:) :: Num a => Matx a -> Vect a -> Vect a
(|:) (M m) v = V . ff $ map (*  v) m
    where
      ff = map $ (foldr (+) 0) . uV

-- composition of linear transformations.
(.:) :: Num a => Matx a -> Matx a -> Matx a
(.:) m n = tr . M $ map ((|:) m) $ (uM.tr) n



