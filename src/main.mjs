import express from "express";
import bodyParser from "body-parser";
import http from "http";
import helmet from "helmet";

import config from "./config.mjs";

scheduleCronJobs();

const app = express();

app.use(helmet());
app.use((req, res, next) => {
    if (config.dev) {
        res.setHeader("Access-Control-Allow-Origin", "*");
    } else {
        res.setHeader("Access-Control-Allow-Origin", "*" /* config.publicUrl */);
    }

    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, authorization, X-PINGOTHER, Cache-Control"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);

    if (req.method === "OPTIONS") {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: false }));

http.createServer(app).listen(config.port, "0.0.0.0", () => {
    console.log(`Listening on ${config.port}`);
});
