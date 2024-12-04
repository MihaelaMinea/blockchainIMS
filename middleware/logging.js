function logging(req, res, next) {
    // console.log(`Logging Request: ${req.method} ${req.url}`);

    // You can add additional logging here if needed
    next();
}

// Function to log Fabric connection events
export function logFabricEvent(message) {
    console.log(`[Fabric Log] ${message}`);
}

export default logging;
