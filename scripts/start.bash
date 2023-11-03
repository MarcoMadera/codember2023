#!/bin/bash

if [ -z "$1" ]
then
  echo "Please enter a challenge number:"
  read challenge
else
  challenge=$1
fi

if [ $challenge -lt 10 ]
then
  challenge=$(printf "%02d" $challenge)
fi

if [ ! -d "./CHALLENGE_$challenge" ]
then
  echo "Challenge $challenge not found. Please try again with a valid challenge number, e.g., '01' for challenge 1."
  exit 1
fi

npx ts-node ./CHALLENGE_$challenge/index.ts
