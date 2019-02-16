module Main where
import Data.List (sort, nub)
import System.Random

type Position = Int
type Velocity = Int
type Probability = (Int, Int)
type Traffic = [Car]

data Car = Car { cid :: Int, pos :: Position, vel :: Velocity} 
  deriving (Show, Eq, Ord)

main = do runNS seed traffic

-- Globals and Constants:
traffic = randTraffic trSize cars
trSize = 100

seed :: StdGen
seed = mkStdGen 23
prob :: Probability
prob = (1,3)

(braking, maxV, cars) = (4, 7, div (trSize * 4) 20) -- edge of chaos, size=200
-- (braking, maxV, cars) = (1, 10, div (trSize * 3) 20) -- all clumpy
-- (braking, maxV, cars) = (1, 5, div (trSize * 7) 20) -- standard model

-- Random Traffic Generation:
-- available positions -> # cars -> Positions
randPositions :: Int -> Int -> [Position]
randPositions p n = sort $ rsel [0..p] p n seed
  where
    rsel ps l 0 g = []
    rsel ps l i g =
      let (j, g') = randomR (0, l) g in
      let c = ps !! j in
      c : rsel (filter (/= c) ps) (l-1) (i-1) g'

-- available positions -> # cars -> Traffic
randTraffic :: Int -> Int -> Traffic
randTraffic p n =
  let vvs = randomRs (0, maxV) seed in
  let pps = randPositions p n in
  tr 0 vvs pps
  where
    tr i (v:vs) [] = []
    tr i (v:vs) (p:ps) = Car i p v : tr (i+1) vs ps

{--
Nagel-Schreckenberg Algorithm:
* accelerate by 1 unit if not max: 5
* slowing down to p(b)-p(a)-1 if v(a) > p(b)-p(a)
* with likelihood p, reduce speed 1 unit
* update positions
--}

distances :: Traffic -> [Int]
distances (t:ts) =
  [mod (pos q - pos p) trSize | -- use of global
    (p, q) <- zip (t:ts) (ts ++ [t])]

updateVs :: Traffic -> Traffic
updateVs tts = uVs tts (distances tts)
  where
    uVs [] _ = []
    uVs ((Car i p v):cs) (d:ds)
      | d > maxV && v < maxV = (Car i p (v+1)) : uVs cs ds -- can increase speed
      | v >= d = (Car i p (d-1)) : uVs cs ds -- imminent collision
      | otherwise = (Car i p v) : uVs cs ds -- all happy max speed

biasedCoins :: StdGen -> Probability -> ([Int], StdGen)
biasedCoins g' pq =
  let rs = take trSize $ randomRs (0, 10^5) g' in -- use of global
  (map (bCoin pq) rs, snd.next $ g')
  where
    bCoin (p, q) r | r < div (p*10^5) q = 0
                   | otherwise = 1

-- with likelihood p, reduce speed by a braking constant.
roadJitters :: StdGen -> Traffic -> (Traffic, StdGen)
roadJitters g cs =
  let (bs, g') = biasedCoins g prob in -- use of global
  let zeroV v b = if v > braking-1 then v-(b*braking) else v in
  let tf = [Car i p (zeroV v b) | (Car i p v, b) <- zip cs bs] in
    (tf, g')

updatePs :: Traffic -> Traffic
updatePs [] = [] -- use of global
updatePs ((Car i p v): cs) =
  (Car i (mod (p+v) trSize) v) : updatePs cs

showTraffic :: Traffic -> String
showTraffic cs = f 0 (sort.map pos $ cs)
  where
    f i [] | i == trSize = "\n" -- use of global
           | otherwise = ' ' : f (i+1) []

    f i (p:ps) | i == trSize = "\n" -- use of global
               | i == p = '*' : f (i+1) ps
               | otherwise = ' ' : f (i+1) (p:ps)

runNS :: StdGen -> Traffic -> IO()
runNS g cs = do
  let uVCs = updateVs cs
  let (uJCs, g') = roadJitters g uVCs
  let uPCs = updatePs uJCs
  putStr $ showTraffic cs
  wait (10^6)
  runNS g' uPCs

wait :: Int -> IO()
wait n = seqn [return () | _ <- [1..n]]

seqn :: [IO a]-> IO()
seqn [] = return ()
seqn (a:as) = do a ; seqn as

