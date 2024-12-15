Blockchain IMS (v3)

This is version 3 of the Blockchain IMS application, built using Hyperledger Fabric.

Setup Instructions
Clone the repository to your local machine.
Modify the .env file to set the required environment variables for # env var for containers.
Use Docker Compose to start the network, which will create the Fabric CA, CouchDB, and Node.js containers.
Once the containers are ruuning and the network is up and connected to containers, revert any temporary changes to the .env file.
Ensure the admin user is registered and enrolled by running the enrollAdmin script.
Once the admin is enrolled, revert any temporary changes to the .env file to # env var for client app.
Start the application locally with npm start. This should enroll admin if it was not already.

Important Notes
Ensure Docker and Docker Compose are installed before starting.
Modify the .env file to set up CouchDB and Fabric CA connections before running the app.
After running containers, revert any temporary changes made in the .env file.
As of now ignore config ( excepting db.js and utils ).
The adminuser dir contains enrollment scripts and wallet stores them.

Dependencies
Hyperledger Fabric
Docker
Node.js
