#!/bin/bash

# Make sure docker is running
docker ps > /dev/null
if [ $? -ne 0 ] ;
	then echo ;
	echo Starting docker ;
	echo --------------- ;
	sudo service docker start ;
fi

# Make bash exit on any error, in piped commands or otherwise
set -e
set -o pipefail

echo Cleaning...
rm -rf ./dist

echo Building app
grunt

cp ./Dockerfile ./dist/

cd dist
npm install --production

echo Building docker image
docker build -t eggert/hgop2015 .

echo "Done"
