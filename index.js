const Kafka = require('node-rdkafka');
const protobuf = require('protobufjs');

async function publishProtobufToKafka(topic, message, key) {
    try {
        const producer = new Kafka.Producer({
            'metadata.broker.list': 'localhost:9092,localhost:9093,localhost:9094', // Update with your Kafka broker address
            'client.id': 'nginx-fwd',
        });

        producer.connect();

        producer.on('ready', function() {
            try {
                producer.produce(
                    // Topic to send the message to
                    topic,
                    // optionally we can manually specify a partition for the message
                    // this defaults to -1 - which will use librdkafka's default partitioner (consistent random for keyed messages, random for unkeyed messages)
                    null,
                    // Message to send. Must be a buffer
                    Buffer.from(message),
                    // for keyed messages, we also specify the key - note that this field is optional
                    [key],
                    // you can send a timestamp here. If your broker version supports it,
                    // it will get added. Otherwise, we default to 0
                    Date.now(),
                    // you can send an opaque token here, which gets passed along
                    // to your delivery reports
                );
            } catch (err) {
                console.error('A problem occurred when sending our message');
                console.error(err);
            } finally {
                console.log(done);
                producer
            }
        });

        producer.on('event.error', (err) => {
            console.error('Kafka producer error:', err);
        });
    } catch (error) {
        console.error('Error publishing message to Kafka:', error);
    }
}

// Example usage
async function main() {
    try {
        // Load your protobuf definition
        const root = await protobuf.load('./message.proto');
        const MessageProto = root.lookupType('message.CampaignSubscriptionMessage');
        const KeyProto = root.lookupType('message.CampaignSubscriptionKey');

        // Create an instance of your protobuf message
        const message = MessageProto.create({
            "id": "6481824a3243b6632460a5f7",
            "requestId": "648187bc001ef23c4c2c5dcb",
            "actionType": "SUBSCRIBE",
            "campaignId": "6481824a3243b6632460a5f7",
            "merchantId": "G527050780",
            "eventTimestamp": Date.now()
        });
        const key = KeyProto.create({
            "id": "6481824a3243b6632460a5f7"
        });

        const topic = 'campaign-subscription';
        const serializedMessage = MessageProto.encode(message).finish();
        const serializedKey = KeyProto.encode(key).finish();

        console.log(topic, serializedMessage)
        console.log('hex display', serializedMessage.toString('hex'))
        await publishProtobufToKafka(topic, serializedMessage, serializedKey);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

(async function() {
    await main();
    console.log('done');
}())