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
  MONGOURL: string;
}

const env: Env = cleanEnv(process.env, {
  MONGO_USERNAME: str(),
  MONGO_PASSWORD: str(),
  TOKEN_HEADER_KEY: str(),
  USER_NAME: str(),
  PASSWORD: str(),
  SERVER_PORT: num({ default: 1337 }),
  MONGOURL: str(),
});

export default env;
