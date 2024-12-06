#!/bin/bash
# This script ensures the creation of the required databases after CouchDB starts.

# Set CouchDB credentials and host
COUCHDB_USER="admin"
COUCHDB_PASSWORD="admin"
COUCHDB_HOST="localhost"  # Change this if CouchDB is not hosted on localhost

# Define the database names
DB1="state_ims"
DB2="ledger_ims"

# Function to check if a database exists
database_exists() {
  echo "Checking existence of database: $1"
  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -u $COUCHDB_USER:$COUCHDB_PASSWORD http://$COUCHDB_HOST:5984/$1)
  
  if [ "$HTTP_STATUS" -eq 200 ]; then
    echo "Database $1 exists."
    return 0  # Database exists
  else
    echo "Database $1 does not exist."
    return 1  # Database doesn't exist
  fi
}

# Function to create a database if it doesn't exist
create_database_if_needed() {
  if ! database_exists $1; then
    echo "Creating database $1..."
    curl -X PUT http://$COUCHDB_USER:$COUCHDB_PASSWORD@$COUCHDB_HOST:5984/$1
    if [ $? -eq 0 ]; then
      echo "Database $1 created successfully."
    else
      echo "Failed to create database $1."
    fi
  else
    echo "Database $1 already exists."
  fi
}

# Wait for CouchDB to be available
echo "Waiting for CouchDB to be available..."
while ! curl -s http://$COUCHDB_USER:$COUCHDB_PASSWORD@$COUCHDB_HOST:5984/ | grep -q "CouchDB"; do
  echo "Waiting for CouchDB to be available..."
  sleep 5
done
echo "CouchDB is up and running!"

# Optionally delete system databases if not needed
echo "Deleting system databases (optional)..."
curl -X DELETE http://$COUCHDB_USER:$COUCHDB_PASSWORD@$COUCHDB_HOST:5984/_users || echo "Failed to delete _users"
curl -X DELETE http://$COUCHDB_USER:$COUCHDB_PASSWORD@$COUCHDB_HOST:5984/_replicator || echo "Failed to delete _replicator"
curl -X DELETE http://$COUCHDB_USER:$COUCHDB_PASSWORD@$COUCHDB_HOST:5984/_global_changes || echo "Failed to delete _global_changes"

# Create required databases if they don't already exist
create_database_if_needed $DB1
create_database_if_needed $DB2

echo "Database initialization complete."
