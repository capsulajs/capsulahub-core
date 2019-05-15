#!/usr/bin/env bash
SERVICE=$1
VERSION_PATH=""

# make sure we are not deleting everything by returning empty slug
SLUG="/error/"

# PR
if [[ ! "$TRAVIS_PULL_REQUEST" == "false" ]]; then
    SLUG="/PR/$TRAVIS_PULL_REQUEST_BRANCH/"
# master # develop
elif [[ "$TRAVIS_BRANCH" == "develop" ]]; then
    SLUG="/$TRAVIS_BRANCH/"
elif [[ "$TRAVIS_BRANCH" == "master" ]]; then
    SLUG="/rc/"
fi;

SERVICE_PATH="services/$VERSION_PATH$SERVICE/"

echo "--------------------------------------------"
echo "  path: $SLUG$SERVICE_PATH                  "
echo "--------------------------------------------"
#echo "path: $SLUG$SERVICE_PATH"

if [[ "$SLUG" == "/error/" ]]; then
    exit 1
fi;
