#!/bin/bash

# Wait for CouchDB to be fully up before running the script
echo "Waiting for CouchDB to start..."
until curl -s http://admin:user@localhost:5984; do
  sleep 2
done

# Create databases if they don't already exist
echo "Creating databases if they don't exist..."

for db in ledger_ims state_ims _users; do
  # Check if the database already exists
  if ! curl -s http://admin:user@localhost:5984/$db | grep -q "not_found"; then
    echo "Database $db already exists, skipping creation."
  else
    curl -X PUT http://admin:user@localhost:5984/$db
    echo "Created database: $db"
  fi
done
