#!/bin/bash

set -e 

echo "Run Database Migrations"
npm run migrate

echo "Run Seeds"
npm run seed

echo "Starting Booking ..."
npm run start

exec "$@"