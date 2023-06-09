import { MONGO_URL, SERVER_PORT } from "../utils/validateEnv";
export const config = {
  mongo: {
    url: MONGO_URL,
  },
  server: {
    port: SERVER_PORT,
  },
};
