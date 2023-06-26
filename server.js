const http = require('http');

const server = http.createServer((req, res) => {
    const { method, url, headers } = req;

    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    });

    req.on('end', () => {
        body = Buffer.concat(body).toString();

        // Log the request details
        console.log('Received request:');
        console.log('Method:', method);
        console.log('URL:', url);
        console.log('Headers:', headers);
        console.log('Body:', body);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Request received successfully');
    });
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
