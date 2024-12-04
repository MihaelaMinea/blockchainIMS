#!/bin/bash

# Variables
COUCHDB_HOST=couchdb
COUCHDB_PORT=5984
COUCHDB_USER=admin
COUCHDB_PASSWORD=user
DB_NAME=state_ims

# Check connection
echo "Connecting to CouchDB at http://${COUCHDB_HOST}:${COUCHDB_PORT}"

# Fetch all documents from the database
curl -u "${COUCHDB_USER}:${COUCHDB_PASSWORD}" \
  "http://${COUCHDB_HOST}:${COUCHDB_PORT}/${DB_NAME}/_all_docs?include_docs=true" \
  -o items.json

# Check the output
if [[ $? -eq 0 ]]; then
  echo "Items retrieved successfully! Check 'items.json' for details."
else
  echo "Failed to retrieve items from CouchDB."
fi
