const { MongoClient } = require('mongodb');
const { DB, CAMPAIGN, CUSTOM_CAMPAIGN } = require('./constant');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = DB;

async function main() {
    await client.connect().then(() => console.log('connected to mongo'));
    ;
    const db = client.db(dbName);
    const campaignCollection = db.collection(CAMPAIGN);

    const campaigns = await campaignCollection.find({ type: CUSTOM_CAMPAIGN });

    const queries = [];
    for await (const campaign of campaigns) {
        const id = campaign._id;
        console.log(`Processing record: ${id}`);
        const timestamp = campaign._id.getTimestamp();

        queries.push(
            campaignCollection.updateOne(
                { _id: id },
                {
                    $set: {
                        "custom_campaign.created_at": timestamp,
                        "custom_campaign.last_updated_at": timestamp
                    }
                }
            )
                .then(() => console.log(`finished processed: ${id} to ${timestamp}`))
                .catch(() => console.warn(`failed processing ${id}`))
        );
    }

    await Promise.all(queries);
    return 'finished';
}

main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());
