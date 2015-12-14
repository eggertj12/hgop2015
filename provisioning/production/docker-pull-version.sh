#!/bin/bash

# Parameters to this script are 
# $1 = Git commit hash to deploy
# $2 = Port number to run on

echo Running revision $1 on port $2

# Disable failing on any error since docker image may not be running
set +e
set +o pipefail
docker kill tictactoe$2
docker rm tictactoe$2

# Disable failing on any error since no docker image may be running
set -e
set -o pipefail
docker pull eggert/hgop2015:$1
docker run -p $2:8080 -d --name tictactoe$2 -e "NODE_ENV=production" eggert/hgop2015:$1
