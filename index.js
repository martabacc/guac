const Kafka = require('node-rdkafka');
const root = require('./proto_def');

async function publishProtobufToKafka(topic, serializedMessage, serializedKey) {
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
                    serializedKey,
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
        const date = new Date("2022-03-25");
        // Get the message type
        const CampaignSubscriptionMessage = root.lookupType('gopaymerchant.esb.campaign.CampaignSubscriptionMessage');
        const rawMsg = {
            id: '002',
            action_type: 1,
            request_id: '12312312312312',
            campaign_id: 'CAMPAIGN_ID',
            merchant_id: 'MERCHANT_ID',
            event_timestamp: {}, // Example timestamp value
        };

        console.log("Message to send:", rawMsg)
        // Create an instance of the CampaignSubscriptionMessage
        const message = CampaignSubscriptionMessage.create(rawMsg);
        // Serialize the message to bytes
        const serializedMessage = CampaignSubscriptionMessage.encode(message).finish();


        /*key*/
        // Get the message type
        const CampaignSubscriptionKey = root.lookupType('gopaymerchant.esb.campaign.CampaignSubscriptionKey');

        // Create an instance of the CampaignSubscriptionKey
        const key = CampaignSubscriptionKey.create({
            id: '6481824a3243b6632460a5f7',
            event_timestamp: { seconds: date / 1000, nanos: 0 }, // Example timestamp value
        });

        // Serialize the key to bytes
        const serializedKey = CampaignSubscriptionKey.encode(key).finish();

        //const sampleBuf = new Buffer.from("0A033030321801220B43414D504149474E5F49442A0B4D45524348414E545F4944" , "hex");
        console.log('Serialized Key:', serializedKey);
        console.log('Serialized message:', serializedMessage);
        console.log('decoded back:', CampaignSubscriptionMessage.decode(serializedMessage));
        await publishProtobufToKafka('campaign-subscription', serializedMessage, serializedKey);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

(async function () {
    await main().then(() => {
        console.log('done')
    })
}())
