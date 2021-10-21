# find an optimal path between multiple points

""" (Ants Colony Optimizer)"""

import random
from random import randrange

class Ant(object):

    def __init__(self, id):
        self.id = id
        self.citylist = [1 for i in range(num_city)]
        self.totaldist = 0.0
        self.currcity = None
        self.startcity = None
        self.total_pvalue = 100.0
        # self.phevalue=None
        self.path = []
        # self.count=0



    def random_spawn(self):
        self.startcity = random.randint(0, num_city - 1)
        self.currcity = self.startcity
        self.citylist[self.currcity] = 0
        self.path.append(self.currcity)
        # print(self.citylist)

    def get_phevalue(self):
        if (self.totaldist == 0):
            return 0.0
        else:
            return self.total_pvalue / self.totaldist



    def move(self, next_city):
        self.path.append(next_city)
        self.totaldist += dist_mat[self.currcity][next_city]
        self.citylist[next_city] = 0
        self.currcity = next_city
        # self.count+=1

    def back_startcity(self):
        self.move(self.startcity)


class TSP(object):

    def __init__(self):
        self.num_city = num_city
        self.num_ants = int(num_city * 2)
        self.ants = []
        self.dist_mat = dist_mat
        # self.prob_mat=[]
        self.phe_mat = []
        self.heu_mat = []
        # self.citytable=[]
        self.alpha = 1.0
        self.beta = 2.0
        self.evap_rate = 0.3
        self.iter = 0
        self.max_iter = 30
        self.init_mat()

    def init_mat(self):

        for i in range(self.num_city):
            self.phe_mat.append([])
            for j in range(self.num_city):
                if i != j and (dist_mat[i][j] != 0):
                    self.phe_mat[i].append(float(2.0))
                else:
                    self.phe_mat[i].append(float(0.0))


    def gen_population(self):
        for i in range(self.num_ants):
            ant = Ant(i)
            self.ants.append(ant)
            ant.random_spawn()

    def calculate_hvalue(self,src,dst):
        if (src != dst ) and (self.dist_mat[src][dst] != 0):
            dist=self.dist_mat[src][dst]
            return 1.0/dist
        else:
            return 0.0

    def update_phemat(self):
        check=[]
        for ant in self.ants:
            for m in range(len(ant.path) - 1):
                src = ant.path[m]
                dst = ant.path[m + 1]

                self.phe_mat[src][dst] = (1 - self.evap_rate) * self.phe_mat[src][dst] + ant.get_phevalue()


    def choose_nextcity(self, ant):
        # Chooses the next city for the ant to visit

        # We calculate a probability distribution for the cities, but
        # since we are using it to randomly select the next city, instead of
        # normalizing it (by calculating the denominator and dividing), we
        # simply use the un-normalized numerator as weights
        # for the random selection

        
        # Calculate the probability distribution (unnormalized)
        prob_list = [0.0 for i in range(self.num_city)]
        for dst in range(self.num_city):
            if ant.citylist[dst] != 0 and dist_mat[ant.currcity][dst] != 0:
                # Need to visit
                prob_list[dst] =  self.phe_mat[ant.currcity][dst] ** self.alpha
                prob_list[dst] += self.calculate_hvalue(ant.currcity,dst) ** self.beta

        # Generate the random choice
        if sum(prob_list) == 0.0:
            return None
        else:
            return random.choices(list(range(self.num_city)), weights=prob_list)[0]



    def one_iter(self):
        self.gen_population()
        for ant in self.ants:

            # print(step)
            while len(ant.path) < self.num_city:
                next_city = self.choose_nextcity(ant)
                if (next_city == None):
                    ant = None
                    break
                if (ant != None):
                    ant.move(next_city)
            if (ant != None):
                ant.back_startcity()
        self.update_phemat()
        # print(self.phe_mat)
        if (self.iter < self.max_iter - 1):
            self.ants.clear()

    def run(self):
        while (self.iter < self.max_iter):
            self.one_iter()
            self.iter += 1
        return self.ants[0].path


def rotate(list):
    list.pop()
    rotate_val = 0
    for i in range(len(list)):
        if list[i] == 0:
            rotate_val = i
    temp = list.copy()
    for i in range(len(list)):
        temp[i - rotate_val] = list[i]
    return temp


def tsp(mtx):

    if len(mtx) < 2:
        return [0]

    global num_city
    num_city = len(mtx)

    global dist_mat
    dist_mat = []
    for i in range(num_city):
        dist_mat.append([])
        for j in mtx[i]:
            dist_mat[i].append(float(j))

    tsp_solver = TSP()
    path = tsp_solver.run()
    ret = rotate(path)
    return ret




 # (Prim's Method)
def tsp2(mtx):
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

