#!/bin/bash

# # Require github credentials as environment variables
# : "${GIT_USER:?Need to set GIT_USER environment variable}"
# : "${GIT_PASS:?Need to set GIT_PASS environment variable}"

# Make bash exit on any error, in piped commands or otherwise
set -e
set -o pipefail

# # Prepare tmp directory for building
# cd ~
# rm -rf build/
# mkdir build/
# cd build/
# 
# # Get code and install dependencies
# git clone https://$GIT_USER:$GIT_PASS@github.com/eggertj12/hgop2015.git
# cd hgop2015

npm install
bower install

# Build the masterpiece
./dockerbuild.sh