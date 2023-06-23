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
                                    camelCase: 'seconds',
                                },
                                nanos: {
                                    type: 'int32',
                                    id: 2,
                                    camelCase: 'nanos',
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
                    camelCase: 'id',
                },
                requestId: {
                    type: 'string',
                    id: 2,
                    camelCase: 'requestId',
                },
                actionType: {
                    type: 'string',
                    id: 3,
                    camelCase: 'actionType',
                },
                campaignId: {
                    type: 'string',
                    id: 4,
                    camelCase: 'campaignId',
                },
                merchantId: {
                    type: 'string',
                    id: 5,
                    camelCase: 'merchantId',
                },
                eventTimestamp: {
                    type: 'google.protobuf.Timestamp',
                    id: 6,
                    camelCase: 'eventTimestamp',
                },
            },
        },
    },
});