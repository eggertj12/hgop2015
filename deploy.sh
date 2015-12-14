#!/bin/bash

# Parameters to this script are 
# $1 = Git commit hash to deploy
# $2 = Port number to run on

# Make sure docker is running
docker ps > /dev/null
if [ $? -ne 0 ] ;
	then echo ;
	echo Starting docker ;
	echo --------------- ;
	sudo service docker start ;
fi

# Require environment variables
# Target server IP
: "${DEPLOY_TARGET:?Need to set DEPLOY_TARGET environment variable to target machine IP address}"
# Target stage
: "${STAGE:?Need to set STAGE environment variable to required staging platform}"

if [ "$STAGE" = "Acceptance" ]; then
	: "${ACCEPTANCE_URL:?Need to set ACCEPTANCE_URL environment variable to testing url}"
fi

# Make bash exit on any error, in piped commands or otherwise
set -e
set -o pipefail

echo
echo Pulling docker image into $DEPLOY_TARGET
echo ----------------------------------------

# # Disable failing on any error since no docker image may be running
# set +e
# set +o pipefail
# ssh vagrant@$DEPLOY_TARGET 'docker kill $(docker ps -q) && docker rm $(docker ps -a -q)'
# 
# # Reenable failing
# set -e
# set -o pipefail
# ssh vagrant@$DEPLOY_TARGET 'docker pull eggert/hgop2015 && docker run -p 9000:8080 -d -e "NODE_ENV=production" eggert/hgop2015'

scp provisioning/production/docker-pull-version.sh vagrant@$DEPLOY_TARGET:~/docker-pull-version.sh
ssh vagrant@$DEPLOY_TARGET ~/docker-pull-version.sh $1 $2

if [ "$STAGE" = "Acceptance" ]; then
	echo
	echo Running acceptance testing
	echo --------------------------

	# Add reporting options
	export MOCHA_REPORTER=xunit
	export MOCHA_REPORT=server-tests.xml

	grunt mochaTest:acceptance
	
	# Make test results accessible in Jenkins workspace
	cp *.xml "$WORKSPACE"

	echo
	echo Restart docker for a fresh start
	echo --------------------------------
	ssh vagrant@$DEPLOY_TARGET 'docker restart $(docker ps -q)'
fi

echo
echo Done