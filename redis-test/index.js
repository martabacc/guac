const Redis = require('ioredis');

console.log(
    process.env.SENTINEL_1,
    process.env.SENTINEL_2,
    process.env.SENTINEL_3,
    process.env.MASTER_SENTINEL
);
// Redis Sentinel configuration
const sentinelOptions = {
    sentinels: [
        { host: process.env.SENTINEL_1, port: 26379 },
        { host: process.env.SENTINEL_2, port: 26379 },
        { host: process.env.SENTINEL_3, port: 26379 }
    ],
    name: process.env.MASTER_SENTINEL
};

async function handleConnect(client) {
    try {
        // Publish a message to a channel
        const reply = await client.publish('myChannel', 'Hello, Redis Sentinel!');
        console.log('Message published:', reply);

        const count = await client.subscribe('myChannel');
        console.log('Subscribed to', count, 'channel(s)');
    } catch (error) {
        console.error('Error in async', error);
    }
}

async function main() {

    // Create Redis Sentinel client
    const sentinelClient = new Redis(sentinelOptions);

    // Connect to the Sentinel
    sentinelClient.on('connect', async () => {
        console.log('Connected to Redis Sentinel');
        await handleConnect(sentinelClient)
    }).on('error', (error) => {
        console.error('An error occurred:', error.message);
    }).on('reconnecting', (attempt, delay) => {
        console.log(`Reconnecting attempt: ${attempt}`);
        console.log(`Next reconnect attempt in ${delay} ms`);
    }).on('message', (channel, message) => {
        console.log('Received message from', channel, ':', message);
    });
}
main();
