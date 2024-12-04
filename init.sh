#!/bin/bash
# Wait for CouchDB to start up (increase if needed)
sleep 30

# Create the state_ims and ledger_ims databases if they don't exist
curl -X PUT http://admin:user@couchdb:5984/state_ims
curl -X PUT http://admin:user@couchdb:5984/ledger_ims
