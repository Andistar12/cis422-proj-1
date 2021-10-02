# find an optimal path between multiple points

def tsp(mtx):
    """
    Calculates the Travelling-Salesman solution for the given graph

    Nodes are identified from 0 to n - 1, where n = len(mtx)

    The graph is given in adjacency matrix form, where the first index is 
    source and second index is destination. For example, mtx[1][2] is the 
    weighted cost of travelling from node 1 to node 2.

    Parameters:
     - mtx: The square adjacency matrix
    Returns:
     - A length n list of the calculated permutation
    """

    # Number of nodes
    n = len(mtx)

    # For now, return nodes in sequential order
    # TODO write actual algorithm
    return [x for x in range(n)]
