#!/bin/bash

# Make bash exit on any error, in piped commands or otherwise
set -e
set -o pipefail

npm install
bower install

# Build the masterpiece
./dockerbuild.sh