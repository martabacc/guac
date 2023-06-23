const protobuf = require('protobufjs');

const root = protobuf.Root.fromJSON({
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
        gopaymerchant: {
            nested: {
                esb: {
                    nested: {
                        campaign: {
                            nested: {
                                CampaignSubscriptionKey: {
                                    fields: {
                                        id: {
                                            type: 'string',
                                            id: 1,
                                        },
                                        event_timestamp: {
                                            type: 'google.protobuf.Timestamp',
                                            id: 2,
                                        },
                                    },
                                },
                                CampaignSubscriptionMessage: {
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
                                            type: 'CampaignSubscriptionActionTypes.Enum',
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
                                CampaignSubscriptionActionTypes: {
                                    nested: {
                                        Enum: {
                                            values: {
                                                UNKNOWN: 0,
                                                SUBSCRIBE: 1,
                                                UNSUBSCRIBE: 2,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
});

module.exports = root;
