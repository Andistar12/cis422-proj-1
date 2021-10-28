# Compares accuracy of TSP implementation with optimal solutions
# 
# Courtesy of TSPLIB
# http://comopt.ifi.uni-heidelberg.de/software/TSPLIB95/

import tsplib95
import os
import tsp
import time

# The optimal times from http://comopt.ifi.uni-heidelberg.de/software/TSPLIB95/ATSP.html
optimal = {
    "br17.atsp": 39,
    "ft53.atsp": 6905,
    "ft70.atsp": 38673,
    "ftv33.atsp": 1286,
    "ftv35.atsp": 1473,
    "ftv38.atsp": 1530,
    "ftv44.atsp": 1613,
    "ftv47.atsp": 1776,
    "ftv55.atsp": 1608,
    "ftv64.atsp": 1839,
    "ftv70.atsp": 1950,
    "ftv90.atsp": 1579,
    "ftv100.atsp": 1788,
    "ftv110.atsp": 1958,
    "ftv120.atsp": 2166,
    "ftv130.atsp": 2307,
    "ftv140.atsp": 2420,
    "ftv150.atsp": 2611,
    "ftv160.atsp": 2683,
    "ftv170.atsp": 2755,
    "kro124p.atsp": 36230,
    "p43.atsp": 5620,
    "rbg323.atsp": 1326,
    "rbg358.atsp": 1163,
    "rbg403.atsp": 2465,
    "rbg443.atsp": 2720,
    "ry48p.atsp": 14422,
}

# Running totals for final accuracy percentag
tot = 0
count = 0

# Iterate files in directory
for f in os.listdir("./tsp"):
    # Load problem
    problem = tsplib95.load("./tsp/" + f)
    n = problem.dimension

    # Skip graphs > 50 (to save time)
    if n > 50:
        continue

    # Construct distance matrix
    mtx = [[problem.get_weight(y, x) for x in range(n)] for y in range(n)]
    
    # Compute result using our TSP
    stime = time.perf_counter()
    result = tsp.tsp(mtx)
    etime = time.perf_counter()

    # Calculate cost of path
    c = 0
    prev = None
    for i in range(len(result)):
        curr = result[i]
        if prev != None:
            c += problem.get_weight(prev, curr)
        prev = curr
    c += problem.get_weight(prev, result[0])

    # Determine optimal path
    opt = optimal[f]

    # Update global vars
    tot += opt / c
    count += 1

    # Print result for this matrix
    print(f"{f}: dimension={n} cost={c} optimal={opt} percent={opt/c:0.5f} time={etime-stime:0.4f}s")

# Print final optimal percentage
print(f"Percentage of optimal: {tot/count:0.5f}")
