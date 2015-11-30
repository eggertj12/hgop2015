#!/bin/bash

# This should make bash exit on any error, in piped commands or otherwise
set -e
set -o pipefail

# TODO: Make sure docker is running

echo
echo Build the docker image
echo ----------------------
./dockerbuild.sh

echo
echo Pushing development docker
echo --------------------------
docker login -u eggert && docker push eggert/hgop2015


echo
echo Pulling docker image into test
echo ------------------------------
# Disable failing on since docker image may be not running
set +e
set +o pipefail
ssh vagrant@192.168.50.12 'docker kill $(docker ps -q) && docker rm $(docker ps -a -q)'

# Reenable failing
set -e
set -o pipefail
ssh vagrant@192.168.50.12 'docker pull eggert/hgop2015 && docker run -p 9000:8080 -d -e "NODE_ENV=production" eggert/hgop2015'

echo
echo Done