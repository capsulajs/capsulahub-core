#!/usr/bin/env bash
FILE=$1

cat "$FILE" | grep "\"name\": \"@capsulajs/" | sed -re "s/\"name\": \"@capsulajs\/(.*)\",*/\1/g"
