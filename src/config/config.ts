import env from "../utils/validateEnv";
export const config = {
  mongo: {
    url: env.MONGOURL,
  },
  server: {
    port: env.SERVER_PORT,
  },
};
