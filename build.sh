#!/bin/bash

# Make bash exit on any error, in piped commands or otherwise
set -e
set -o pipefail

npm install
bower install

# Add reporting options
export MOCHA_REPORTER=xunit
export MOCHA_REPORT=server-tests.xml

# Build the masterpiece
./dockerbuild.sh