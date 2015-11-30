#!/bin/bash

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
