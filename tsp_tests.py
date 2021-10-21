"""
Tests for tsp.py solution
To run the tests on this file do the following:
    Basic test:
        $ python3 tsp_tests.py
    Verbose test to see each test function's success or failure:
        $ python3 -m unittest -v tsp_tests.py
    Test with performance profiling:
        $ python3 -m cProfile -s cumtime tsp_tests.py
"""

import unittest
from random import randrange
from tsp import tsp

class TestTSP(unittest.TestCase):
    """
    Unit tests for tsp function in tsp.py
    """

    def test_empty_mtx(self):
        """
        Tests that an empty matrix through tsp produces a path that is [0]
        """
        self.assertEqual(tsp([[]]), [0])

    def test_mtx_1x1(self):
        """
        Tests that a 1x1 matrix through tsp produces path that is [0]
        """
        self.assertEqual(tsp([[0]]), [0])

    def test_mtx_2x2(self):
        """
        Tests that a 2x2 matrix through tsp produces a path that is [0,1]
        """
        self.assertEqual(tsp([[0,1],
                              [1,0]]), [0,1])

    def test_mtx_3x3(self):
        """
        Tests that a 3x3 matrix through tsp produces a path that is either
        [0,1,2] or [0,2,1]
        """
        tsp_solution = tsp(gen_rand_mtx(3))
        self.assertTrue(tsp_solution == [0,1,2] or
                        tsp_solution == [0,2,1])

    def test_mtx_arbitrary(self):
        """
        Tests that an nxn matrix produces a valid path
        """
        # generate an arbitrary n x n matrix
        n = 25
        tsp_solution = tsp(gen_rand_mtx(n))

        # check that the solution array starts with 0, the starting node.
        self.assertEqual(tsp_solution[0], 0)

        # check if all nodes in mtx
        # and solution is same length as number of nodes
        self.assertTrue(check_all_nodes_in(tsp_solution, n))

# --- HELPER FUNCTIONS --- #
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
                row.append(randrange(0,1000))
        mtx.append(row)
    return mtx

def check_all_nodes_in(array, n):
    """
    Args:
        array: the solution list from tsp
                which has the nodes in the solution path
        n: the int size of the matrix
    Returns: boolean saying whether or not all the nodes were in the solution
    """
    nodes = [i for i in range(n)]
    for node in array:
        if node in nodes:
            nodes.remove(node)
    return not nodes

if __name__ == '__main__':
    unittest.main(module="tsp_tests")
