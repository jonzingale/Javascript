module NagelSchreckenberg where
import Data.List (sort)
import System.Random

type Position = Int
type Velocity = Int

data Car = Car { cid :: Int, position :: Position, velocity :: Velocity} 
  deriving (Show, Eq, Ord)

type Traffic = [Car]

-- Globals and Constants:
seed :: StdGen
seed = mkStdGen 23

trSize = 100
car0 = Car 0 23 2
car1 = Car 1 51 3
traffic = randTraffic trSize 5


-- Random Traffic Generation.

-- available positions -> # cars -> Positions
randPositions :: Int -> Int -> [Position]
randPositions p n = sort $ rsel [0..p-1] p n seed
  where
    rsel ps l 0 g = []
    rsel ps l i g = 
      let (j, g') = randomR (0, l) g in
      let c = ps !! j in
      c : rsel (filter (/= c) ps) (l-1) (i-1) g'

-- available positions -> # cars -> Traffic
randTraffic :: Int -> Int -> Traffic
randTraffic p n =
  let vvs = randomRs (0, 5) seed in
  let pps = randPositions p n in
  tr 0 vvs pps
  where
    tr i (v:vs) [] = []
    tr i (v:vs) (p:ps) = Car i p v : tr (i+1) vs ps


-- N-S functions

neighPos :: Traffic -> Car -> Position
neighPos t c = position.((!!) t) $ mod (cid c + 1) (length t)

distances :: Traffic -> [Int]
distances (t:ts) =
  [mod (position q - position p) trSize |
    (p, q) <- zip (t:ts) (ts ++ [t])]

updateVs :: Traffic -> Traffic
updateVs tts = uVs tts (distances tts)
  where
    uVs [] _ = []
    uVs ((Car i p v):cs) (d:ds)
      | d > 5  = (Car i p v) : uVs cs ds
      | otherwise = (Car i p (d-v)) : uVs cs ds



