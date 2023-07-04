'use strict';

let Redis = require('ioredis');
let redis = new Redis({
    sentinels: [
        { host: '127.0.0.1', port: 15379 },
        { host: '127.0.0.1', port: 15380 },
        { host: '127.0.0.1', port: 15381 }
    ],
    name: 'mymaster'
});

let func = Redis.Promise.coroutine(function* () {
    let key = 'foo:' + Math.random();

    try {
        yield redis.setex(key, 10, 'xxxxxxxxx').timeout(1000);
        let value = yield redis.get(key).timeout(1000);
        console.log(Date.now(), value);
    }
    catch (err) {
        console.error(err);
    }
});

let loop = function() {
    func().then(loop).catch(function(err) {
        console.error(err.stack);
        process.exit(1);
    });
}

redis.once('ready', function() {
    loop();
});
