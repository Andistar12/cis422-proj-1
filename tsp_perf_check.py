# Measures the performance of the TSP algorithm on random matrices


import random
import tsp
import time

def gen_rand_mtx(n):
    """
    Args:
        n: Int size of matrix
    Returns: n x n matrix
    """
    mtx = []
    for i in range(n):
        row = []
        for j in range(n):
            if i == j:
                row.append(0)
            else:
                row.append(random.randrange(0,1000))
        mtx.append(row)
    return mtx


def test_mtx(n):
    mtx = gen_rand_mtx(n)
    iters = 10
    stime = time.perf_counter()
    for _ in range(iters):
        tsp.tsp(mtx)
    etime = time.perf_counter()
    t = (etime - stime) / iters
    print(f"dims={n} time={t:0.4f}s")


if __name__ == "__main__":
    for i in range(50):
        test_mtx(i)