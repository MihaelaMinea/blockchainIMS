#!/bin/sh
# wait-for-couchdb.sh
echo "Waiting for CouchDB to be ready..."
until curl -s http://admin:admin_password@couchdb:5984/_up; do
  echo "CouchDB is not ready yet... waiting."
  sleep 5
done
echo "CouchDB is up and running!"
