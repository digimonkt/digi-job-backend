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
  MONGO_USERNAME: str(),
  MONGO_PASSWORD: str(),
  TOKEN_HEADER_KEY: str(),
  USER_NAME: str(),
  PASSWORD: str(),
  SERVER_PORT: num({ default: 1337 }),
});

const MONGO_USERNAME = env.MONGO_USERNAME;
const MONGO_PASSWORD = env.MONGO_PASSWORD;
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.rpp1gux.mongodb.net/koor`;
const SERVER_PORT = env.SERVER_PORT;

export default env;
export { MONGO_URL, SERVER_PORT };
