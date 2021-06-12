import dotenv from "dotenv";

dotenv.config();

export default {
    publicUrl: process.env.PUBLIC_URL,
    port: parseInt(process.env.PORT, 10),
    dev: process.env.NODE_ENV === "development",
    telegram: {
        token: process.env.TELEGRAM_BOT_TOKEN
    }
};
