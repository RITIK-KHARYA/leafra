// Vitest global setup: load .env.local so modules that read env vars at
// import time (lib/env, lib/db, lib/logger) can validate successfully.
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
