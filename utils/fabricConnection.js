import { Gateway, Wallets } from 'fabric-network';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Manually define __dirname in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to connection.json
const ccpPath = path.resolve(__dirname, 'connection.json');
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

// Connect to the Fabric network
export async function connectToFabric() {
    try {
        // Load a wallet for managing identities
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check if the identity exists
        const identity = await wallet.get('appUser'); // Replace with your user identity
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            return null;
        }

        // Create a gateway connection
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: 'appUser',
            discovery: { enabled: true, asLocalhost: true }
        });

        console.log('Successfully connected to Fabric network');
        return gateway;

    } catch (error) {
        console.error(`Failed to connect to the Fabric network: ${error}`);
        process.exit(1);
    }
}

// Disconnect from the Fabric network
export async function disconnectFromFabric(gateway) {
    if (gateway) {
        await gateway.disconnect();
        console.log('Disconnected from Fabric network');
    }
}
