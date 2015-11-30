#!/bin/bash

echo
echo Pushing development docker
echo --------------------------
cd vagrant
vagrant ssh -c 'docker login -u eggert && docker push eggert/hgop2015'
cd ..

echo
echo Pulling docker image into test
echo ------------------------------
cd ../testenv/
vagrant ssh -c 'docker kill $(docker ps -q) && docker rm $(docker ps -a -q)'
vagrant ssh -c 'docker pull eggert/hgop2015 && docker run -p 9000:8080 -d -e "NODE_ENV=production" eggert/hgop2015'
cd ../tictactoe/

echo
echo Done