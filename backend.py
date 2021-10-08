# serve pages using Flask

import os # Used to fetch environment vars for parameters
import sys # Used to access command-line parameters
import json # Used for config loading
import logging # Used for logging
import flask # Used as the backend and for webpage rendering
import tsp # Our TSP solver

# Global variables

app = flask.Flask(__name__)

# Determine the appropriate config file location
cfgloc = ""
try:
    cfgloc = os.environ["CONFIG_LOC"]
except KeyError:
    # config file location can be specified via command line argument
    if len(sys.argv) > 1 and os.path.exists(sys.argv[1]):
        cfgloc = sys.argv[1]

# Read files from config 
try:
    with open(cfgloc) as cfgfile:
        config = json.load(cfgfile)
except Exception:
    logging.getLogger("backend").error("Error occurred opening config file", exc_info=True)
    config = {}

# Fetch config parameters
app.port = config.get("port", 27017)
app.secret_key = config.get("secret_key", "")
app.debug = config.get("debug", True)
app.gapi_key = config.get("gapi_key", "")


# Page endpoints

@app.route("/")
@app.route("/index")
def index():
    """
    Returns the index page
    """
    return flask.render_template("index.html", API_KEY=app.gapi_key)


@app.errorhandler(404)
def page_not_found(error):
    """
    Returns the 404 page
    """
    flask.session["linkback"] = flask.url_for("index")
    return flask.render_template("404.html"), 404


# TSP solver endpoint

@app.route("/_solve_tsp", methods=["POST"])
def tsp():
    """
    Serves the solution to the TSP problem
    """

    # TODO parse the matrix from the request data, get the TSP answer
    # And send it back
    mtx = flask.request.json["mtx"]
    answer = tsp.tsp(mtx)

    result = {
        "answer": answer
    }

    return flask.jsonify(result=result)


if __name__ == "__main__":
    # Run app
    print(f"Launching flask app on port {app.port}")
    app.run(port=app.port, host="0.0.0.0", debug=app.debug)
