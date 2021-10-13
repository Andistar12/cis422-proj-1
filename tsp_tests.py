import unittest
from tsp import tsp

class TestTSP(unittest.TestCase):
    def test_empty_mtx(self):
        self.assertEqual(tsp([[]]), [0])

    def test_mtx_1x1(self):
        self.assertEqual(tsp([[0]]), [0])

    def test_mtx_2x2(self):
        self.assertEqual(tsp([[0,1],
                              [1,0]]), [0,1])

    def test_mtx_3x3(self):
        self.assertEqual(tsp([[0,2,4],
                              [2,0,3],
                              [4,3,0]]), [0,1,2])

    def test_mtx_arbitrary(self):
        # TODO: Change mtx to be random
        # TODO: Add check if all nodes in the mtx
        mtx = [[0, 9, 75, 0, 0],
                [9, 0, 95, 19, 42],
                [75, 95, 0, 51, 66],
                [0, 19, 51, 0, 31],
                [0, 42, 66, 31, 0]] # change to be random
        tsp_solution = tsp(mtx)
        self.assertEqual(len(mtx[0]), len(tsp_solution))
        self.assertEqual(tsp_solution[0], 0)
        # check if all nodes in mtx

if __name__ == '__main__':
    unittest.main()
