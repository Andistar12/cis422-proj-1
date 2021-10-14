#!/bin/bash

# Deploys a development server of the app via Python (assuming requirements.txt installed)
#
# To bring up the development server, run the following
#
#   ./run.sh

export CONFIG_LOC="./config.json"
python3 backend.py
