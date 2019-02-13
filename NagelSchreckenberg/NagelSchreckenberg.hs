module NagelSchreckenberg where
import Data.List (sort)
import System.Random

type Position = Int
type Velocity = Int

data Car = Car { cid :: Int, position :: Position, velocity :: Velocity} 
  deriving (Show, Eq, Ord)

type Traffic = [Car]

{--
Random Traffic Generation.
--}
seed :: StdGen
seed = mkStdGen 23

-- possible positions -> number of cars -> selected positions
randPositions :: Int -> Int -> [Int]
randPositions p n = sort $ rsel [0..p-1] p n seed
  where
    rsel ps l 0 g = []
    rsel ps l i g = 
      let (j, g') = randomR (0, l) g in
      let c = ps !! j in
      c : rsel (filter (/= c) ps) (l-1) (i-1) g'

-- possible positions -> number of cars -> Traffic
randTraffic :: Int -> Int -> Traffic
randTraffic p n =
  let vvs = randomRs (0, 5) seed in
  let pps = randPositions p n in
  tr 0 vvs pps
  where
    tr i (v:vs) [] = []
    tr i (v:vs) (p:ps) = Car i p v : tr (i+1) vs ps

{--
Perhaps think of the board as an indexed list of cars.
A car found in position n can then query about the car at n+1. 
--}

car0 = Car 0 23 2
car1 = Car 1 51 3
traffic = randTraffic 100 5

neighPos :: Traffic -> Car -> Position
neighPos t c = position.((!!) t) $ mod (cid c + 1) (length t)


