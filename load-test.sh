#!/bin/bash

# Require environment variables
# Target server IP
: "${TEST_TARGET:?Need to set TEST_TARGET environment variable to target machine IP address}"
: "${CAPACITY_URL:?Need to set CAPACITY_URL environment variable to testing url}"

# Optional config environment variables are $CAPACITY_GAME_COUNT and #CAPACITY_TIME_LIMIT

# Make bash exit on any error, in piped commands or otherwise
set -e
set -o pipefail

echo
echo Restart docker for a fresh start
echo --------------------------------
ssh vagrant@$TEST_TARGET 'docker restart $(docker ps -q)'

echo
echo Running load testing
echo --------------------
grunt mochaTest:load

echo
echo Restart docker again just for good measure
echo ------------------------------------------
ssh vagrant@$TEST_TARGET 'docker restart $(docker ps -q)'

echo
echo Done