{-# OPTIONS_GHC -fno-warn-missing-methods #-}

module LinearAlgebra where
import Data.List (transpose, intersperse)

{--
linear algebra for SIR models
--}

a = M [V [0,1,0,1,0],
       V [1,0,1,1,0],
       V [0,1,0,0,0],
       V [1,1,0,0,1],
       V [0,0,0,1,0]]

i = V [1,0,1,0,0]
s = V [0,1,0,0,1]

-- true susceptibility
ts = a <|> i * s

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
(<|>) :: Num a => Matx a -> Vect a -> Vect a
(<|>) (M m) v = V . ff $ map (*  v) m
    where
      ff = map $ (foldr (+) 0) . uV

-- composition of linear transformations.
(.:) :: Num a => Matx a -> Matx a -> Matx a
(.:) m n = tr . M $ map ((<|>) m) $ (uM.tr) n

-- unsafe matrix from tensored vectors
tensor :: Num a => Vect a -> Vect a -> Matx a
tensor v w = let vw = v *: w in
    M $ ff (uV vw) ((length.uV) v)
    where
        ff [] _ = []
        ff vs n = V (take n vs) : ff (drop n vs) n









