{-# OPTIONS_GHC -fno-warn-missing-methods #-}
module Epidemics where
import LinearAlgebra ((<|>), Vect(..), Matx(..), uV)
import Data.List (transpose, intersperse)
import System.Random

{--
Write a linear algebraic SIR network model
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

-- calculate probability P(A) + P(B) - P(A&B)
pr :: Integral a => Float -> a -> Float
pr p 0 = 0
pr p n = (fromIntegral n) * p - p^n --VERIFY

prV :: Integral a => Float -> Vect a -> Vect Float
prV p v = V $ map (pr (1/2)) (uV ts)

{-- Randomness --}
seed :: StdGen
seed = mkStdGen 32

-- likelihood of being True
biasedCoin :: StdGen -> Float -> (Bool, StdGen)
biasedCoin g p =
    let (a, g') = random g in
    let n = fromIntegral range * p in
    let d = fromIntegral (a `mod` range) in
    (n > d, g')
    where
      range = snd.genRange.mkStdGen $ 32

-- contractibility
prContract = prV (1/3) ts
nextInfected = map (fst.biasedCoin seed) (uV prContract)
