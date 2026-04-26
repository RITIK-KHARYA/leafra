// Vitest global setup: prefer .env.local, but fall back to .env so test
// runs still work in local setups that only define project env there.
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env", override: false });
