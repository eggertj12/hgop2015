#!/bin/bash

# Require environment variables
# Target server IP
: "${TEST_TARGET:?Need to set TEST_TARGET environment variable to target machine IP address}"
: "${ACCEPTANCE_URL:?Need to set ACCEPTANCE_URL environment variable to testing url}"

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

# Add reporting options
export MOCHA_REPORTER=xunit
export MOCHA_REPORT=server-tests.xml

grunt mochaTest:load

# Make test results accessible in Jenkins workspace
cp *.xml "$WORKSPACE"

echo
echo Restart docker again just for good measure
echo ------------------------------------------
ssh vagrant@$TEST_TARGET 'docker restart $(docker ps -q)'

echo
echo Done