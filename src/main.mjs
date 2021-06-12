import express from "express";
import bodyParser from "body-parser";
import http from "http";
import helmet from "helmet";
import fs from "fs/promises";

import config from "./config.mjs";
import { sendMessage } from "./telegramBot.mjs";

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

app.use(bodyParser.json({ limit: "2mb" }));
app.use(bodyParser.urlencoded({ extended: false }));

async function loadData() {
    return JSON.parse(await fs.readFile("data.json", "utf8"));
}

async function saveData(data) {
    await fs.writeFile("data.json", JSON.stringify(data, null, 4));
}

app.get("/data", async (req, res) => {
    res.json(await loadData());
});

app.get("/redeem/:couponId", async (req, res) => {
    const data = await loadData();
    const couponId = parseInt(req.params.couponId);
    let foundCoupon = null;

    for (const coupon of data.coupons) {
        console.log(coupon, couponId);
        if (coupon.id === couponId) {
            foundCoupon = coupon;
        }
    }

    if (!foundCoupon) {
        return res.status(404).json({ msg: "Coupon not found" });
    }

    if (foundCoupon.redeemed) {
        return res.status(400).json({ msg: "Coupon already redeemed" });
    }

    foundCoupon.redeemed = true;

    await sendMessage(`"${foundCoupon.name}" wurde eingelöst!`);

    await saveData(data);

    res.json({ success: true });
});

http.createServer(app).listen(config.port, "0.0.0.0", () => {
    console.log(`Listening on ${config.port}`);
});
