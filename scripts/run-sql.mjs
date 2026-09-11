import fs from "fs";
import { socksFetch } from "./socks-fetch.mjs";

const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const PROJECT_REF = "lwcgltsfqtahiwiqvbhq";
const arg = process.argv[2];

if (!ACCESS_TOKEN || !arg) {
  console.error("Usage: SUPABASE_ACCESS_TOKEN=... node scripts/_run-sql.mjs \"<SQL or file path>\"");
  process.exit(1);
}

const sql = fs.existsSync(arg) ? fs.readFileSync(arg, "utf-8") : arg;

const res = await socksFetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query: sql }),
});

const text = await res.text();
console.log("Status:", res.status);
console.log(text);
