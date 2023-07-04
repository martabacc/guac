const redis = require('redis');

// Redis Sentinel configuration
const sentinelOptions = {
    sentinels: [
        { host: process.env.SENTINEL_1, port: 26379 },
        { host: process.env.SENTINEL_2, port: 26379 },
        { host: process.env.SENTINEL_3, port: 26379 }
    ],
    name: 'LordMaster'
};

// Create Redis Sentinel client
const sentinelClient = redis.createClient(sentinelOptions);

// Connect to the Sentinel
sentinelClient.on('connect', () => {
    console.log('Connected to Redis Sentinel');
});

// Publish a message to a channel
sentinelClient.publish('myChannel', 'Hello, Redis Sentinel!', (err, reply) => {
    if (err) {
        console.error('Error publishing message:', err);
    } else {
        console.log('Message published:', reply);
    }
});

// Subscribe and listen for messages on a channel
const subscriber = redis.createClient();
subscriber.on('message', (channel, message) => {
    console.log('Received message from', channel, ':', message);
});

subscriber.subscribe('myChannel', (err, count) => {
    if (err) {
        console.error('Error subscribing to channel:', err);
    } else {
        console.log('Subscribed to', count, 'channel(s)');
    }
});
