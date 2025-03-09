import dotenv from "dotenv";
import { cleanEnv, host, num, port, str, testOnly } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    devDefault: testOnly("test"),
    choices: ["development", "production", "test"],
  }),
  HOST: host({ devDefault: testOnly("localhost") }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly("http://localhost:3000") }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  MONGO_ADMIN_USER: str({ devDefault: testOnly("admin") }),
  MONGO_ADMIN_PASSWD: str({ devDefault: testOnly("stronkAndSekret") }),
  DB_USERNAME: str({ devDefault: testOnly("tarik") }),
  DB_PASSWORD: str({ devDefault: testOnly("superSekret") }),
  DB_NAME: str({ devDefault: testOnly("ticketing") }),
  ME_CONFIG_BASICAUTH: str({ devDefault: testOnly("false") }),
  ME_CONFIG_MONGODB_ENABLE_ADMIN: str({ devDefault: testOnly("false") }),
});
