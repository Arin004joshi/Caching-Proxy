import express from 'express';
import axios from 'axios';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
// import NodeCache from 'node-cache';

// Cache storage
const cache = new NodeCache({
    stdTTL: 300,  // 5 minutes in seconds
    checkperiod: 60  // Check for expired keys every 60 seconds
});

const argv = yargs(hideBin(process.argv))
    .option('port', {
        description: "Port to run the proxy server on",
        type: "number",
        default: 3000
    })
    .option('origin', {
        description: "Origin server URL to proxy requests to",
        type: "string",
        demandOption: true
    })
    .help()
    .argv;

console.log(argv);

const app = express();

// middleware to handle every req
app.use(async (req, res) => {
    console.log(`Received: ${req.method} ${req.path}`);
    const originUrl = `${argv.origin}${req.path}`;
    console.log("The original url is : " + originUrl);
    try {

        const cacheKey = `${req.method}_${originUrl}`

        if (cache.has(cacheKey)) {
            const cachedData = cache.get(cacheKey);
            console.log("Cache HIT!");
            res.send(cachedData);
            return;
        }
        console.log("Cache MISS - forwarding to origin");
        const response = await axios({
            method: req.method,
            url: originUrl
        })
        cache.set(cacheKey, response.data);
        res.send(response.data);
    } catch (error) {
        console.log("error while sending req to origin" + error);
        res.status(500).send('Proxy error');
    }
});

app.listen(argv.port, () => {
    console.log("server is listening to port : " + argv.port);
})