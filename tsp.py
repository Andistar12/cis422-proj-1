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
     - A length n list of the calculated permutation, where 0 is always the first entry
    """

    # Number of nodes
    n = len(mtx)
    selected = [0 for _ in range(n)]
    selected[0] = 1
    numedges = 0
    MST = []

    while(len(MST) < n):
        min = float("inf")
        node = 0
        for i in range(n):
            if selected[i]:
                if i not in MST:
                    MST.append(i)
                for j in range(n):
                    if (not selected[j]) and (mtx[i][j]):
                        if mtx[i][j] < min:
                            min = mtx[i][j]
                            node = j
        selected[node] = 1
        numedges += 1
    return MST


