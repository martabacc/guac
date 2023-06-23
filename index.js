const Kafka = require('node-rdkafka');
const root = require('./proto_def');

async function publishProtobufToKafka(topic, serializedMessage) {
    try {
        const producer = new Kafka.Producer({
            'metadata.broker.list': 'localhost:9092,localhost:9093,localhost:9094', // Update with your Kafka broker address
            'dr_msg_cb': true, // Enable delivery reports
            'event_cb': true, // Enable event callbacks
            'client.id': 'nginx-fwd',
        });

        producer.connect();

        producer.on('ready', function () {
            try {
                producer.produce(
                    // Topic to send the message to
                    topic,
                    // optionally we can manually specify a partition for the message
                    // this defaults to -1 - which will use librdkafka's default partitioner (consistent random for keyed messages, random for unkeyed messages)
                    null,
                    // Message to send. Must be a buffer
                    serializedMessage,
                    // for keyed messages, we also specify the key - note that this field is optional
                    null,
                    // you can send a timestamp here. If your broker version supports it,
                    // it will get added. Otherwise, we default to 0
                    Date.now(),
                    // you can send an opaque token here, which gets passed along
                    // to your delivery reports,
                    () => {
                        console.log('Message delivered to Kafka!');
                    }
                );

            } catch (err) {
                console.error('A problem occurred when sending our message');
                console.error(err);
            } finally {
                console.log('done');
                process.exit(0)
            }
        });

        producer.on('event.error', (err) => {
            console.error('Kafka producer error:', err);
            process.exit(1)
        });
    } catch (error) {
        console.error('Error publishing message to Kafka:', error);
        process.exit(1)
    }
}

// Example usage
async function main() {
    try {
        const MyMessage = root.lookupType('MyMessage');
        const Timestamp = root.lookupType('google.protobuf.Timestamp');

        // Create an instance of the Timestamp message
        const timestamp = Timestamp.fromObject({
            seconds: Math.floor(Date.parse('2023-06-23T10:40:21Z') / 1000),
            nanos: 0,
        });

        // Create an instance of the MyMessage message
        const message = MyMessage.create({
            id: '6481824a3243b6632460a5f7',
            requestId: '648187bc001ef23c4c2c5dcb',
            actionType: '1',
            campaignId: '6481824a3243b6632460a5f7',
            merchantId: 'G527050780',
            eventTimestamp: timestamp,
        });

        // Serialize the message to bytes
        const serializedMessage = MyMessage.encode(message).finish();

        console.log('campaign-subscription', serializedMessage)
        await publishProtobufToKafka('campaign-subscription', serializedMessage);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

(async function () {
    await main().then(() => {
        console.log('done')
    })
}())