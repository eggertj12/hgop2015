#!/bin/bash

# Make sure docker is running
docker ps > /dev/null
if [ $? -ne 0 ] ;
	then echo ;
	echo Starting docker ;
	echo --------------- ;
	sudo service docker start ;
fi

# Require Target server IP as an environment variable
: "${DEPLOY_TARGET:?Need to set DEPLOY_TARGET environment variable to target machine IP address}"

# Make bash exit on any error, in piped commands or otherwise
set -e
set -o pipefail

# echo
# echo Build the docker image
# echo ----------------------
# ./dockerbuild.sh

echo
echo Pushing development docker
echo --------------------------
docker login -u eggert && docker push eggert/hgop2015

echo
echo Pulling docker image into test
echo ------------------------------

# Disable failing on any error since no docker image may be running
set +e
set +o pipefail
ssh vagrant@$DEPLOY_TARGET 'docker kill $(docker ps -q) && docker rm $(docker ps -a -q)'

# Reenable failing
set -e
set -o pipefail
ssh vagrant@$DEPLOY_TARGET 'docker pull eggert/hgop2015 && docker run -p 9000:8080 -d -e "NODE_ENV=production" eggert/hgop2015'

echo
echo Done