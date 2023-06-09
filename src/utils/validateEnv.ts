import { cleanEnv, str, num } from "envalid";
import dotenv from "dotenv";

dotenv.config();
interface Env {
  MONGO_USERNAME: string;
  MONGO_PASSWORD: string;
  TOKEN_HEADER_KEY: string;
  USER_NAME: string;
  PASSWORD: string;
  SERVER_PORT: number;
}

const env: Env = cleanEnv(process.env, {
  MONGO_USERNAME: str({ default: "admin" }),
  MONGO_PASSWORD: str({ default: process.env.MONGO_PASSWORD || "" }),
  TOKEN_HEADER_KEY: str({ default: process.env.TOKEN_HEADER_KEY || "" }),
  USER_NAME: str({ default: process.env.USER_NAME || "" }),
  PASSWORD: str({ default: process.env.PASSWORD || "" }),
  SERVER_PORT: num({ default: 1337 }),
});

const MONGO_USERNAME = env.MONGO_USERNAME || "admin";
const MONGO_PASSWORD = env.MONGO_PASSWORD || "admin";
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.rpp1gux.mongodb.net/koor`;
const SERVER_PORT = env.SERVER_PORT;

export default env;
export { MONGO_URL, SERVER_PORT };
