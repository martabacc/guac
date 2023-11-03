const fs = require('fs');
const pth = require('path');
const { CUSTOM_CAMPAIGN } = require('./constant');
const { ObjectId } = require('mongodb');

const generateQuery = (id, timestamp) => (`db.getCollection('campaign').updateOne({ _id: ObjectId('${id}') }, { $set: { 'custom_campaign.created_at': ISODate('${timestamp}'), 'custom_campaign.last_updated_at': ISODate('${timestamp}')}} )`);

async function main() {
    const source = await fs.readFileSync(pth.join(__dirname, 'source.json'));
    const result = [];
    const campaigns = JSON.parse(source.toString());

    for (const campaign of campaigns) {
        if (campaign.type === CUSTOM_CAMPAIGN) {
            const id = new ObjectId(campaign._id.$oid);
            const timestamp = id.getTimestamp();

            const query = generateQuery(id.toString(), timestamp.toISOString());
            result.push(query);
        }
    }

    console.log(`finished checking ${campaigns.length}, ${result.length} query(s) to run`)

    await fs.writeFileSync('queries.json', JSON.stringify(result), 'utf8');
}

main()
    .catch(console.error)
    .finally(() => console.log('fin.'));
