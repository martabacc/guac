const Redis = require('ioredis');

console.log(
    process.env.SENTINEL_1,
    process.env.SENTINEL_2,
    process.env.SENTINEL_3
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

console.log(sentinelOptions)
// Create Redis Sentinel client
const sentinelClient = new Redis(sentinelOptions);

// Connect to the Sentinel
sentinelClient.on('connect', () => {
    console.log('Connected to Redis Sentinel');
}).on('error', e => {
    console.error('error during connecting', e.message || 'no e obj');
});

// Publish a message to a channel
sentinelClient.publish('myChannel', 'Hello, Redis Sentinel!')
    .then((reply) => {
        console.log('Message published:', reply);
    })
    .catch((err) => {
        console.error('Error publishing message:', err);
    });

// Subscribe and listen for messages on a channel
const subscriber = new Redis();
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
