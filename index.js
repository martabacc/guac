const Kafka = require('node-rdkafka');
const protobuf = require('protobufjs');

async function publishProtobufToKafka(topic, message, key) {
    try {
        const producer = new Kafka.Producer({
            'metadata.broker.list': 'localhost:9092,localhost:9093,localhost:9094', // Update with your Kafka broker address
        });

        producer.connect();

        producer.on('ready', () => {
            const payload = {
                topic,
                messages: [message],
                // If you want to customize partitioning, uncomment the following line:
                 key: [key]
            };

            producer.produce(payload, (err) => {
                if (err) {
                    console.error('Error publishing message to Kafka:', err);
                } else {
                    console.log('Message published successfully to Kafka!');
                }
                producer.disconnect();
            });
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

main();