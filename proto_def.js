const protobuf = require('protobufjs');

module.exports = protobuf.Root.fromJSON({
    nested: {
        google: {
            nested: {
                protobuf: {
                    nested: {
                        Timestamp: {
                            fields: {
                                seconds: {
                                    type: 'int64',
                                    id: 1,
                                },
                                nanos: {
                                    type: 'int32',
                                    id: 2,
                                },
                            },
                        },
                    },
                },
            },
        },
        MyMessage: {
            fields: {
                id: {
                    type: 'string',
                    id: 1,
                },
                request_id: {
                    type: 'string',
                    id: 2,
                },
                action_type: {
                    type: 'string',
                    id: 3,
                },
                campaign_id: {
                    type: 'string',
                    id: 4,
                },
                merchant_id: {
                    type: 'string',
                    id: 5,
                },
                event_timestamp: {
                    type: 'google.protobuf.Timestamp',
                    id: 6,
                },
            },
        },
    },
});