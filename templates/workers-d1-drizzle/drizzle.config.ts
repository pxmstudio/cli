import { config } from "dotenv";
import type { Config } from 'drizzle-kit';
import fs from "fs";
import path from "path";

config();

const getLocalD1 = () => {
  try {
    const basePath = path.resolve('.wrangler');
    const dbFile = fs
      .readdirSync(basePath, { encoding: 'utf-8', recursive: true })
      .find((f) => f.endsWith('.sqlite'));

    if (!dbFile) {
      throw new Error(`.sqlite file not found in ${basePath}`);
    }

    const url = path.resolve(basePath, dbFile);
    return url;
  } catch (err) {
    console.log(`Error  ${err}`);
  }
}

const isProd = () => process.env.NODE_ENV === 'production'

const getCredentials = () => {
  const prod = {
    driver: 'd1-http',
    dbCredentials: {
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
      databaseId: process.env.CLOUDFLARE_DATABASE_ID,
      token: process.env.CLOUDFLARE_D1_TOKEN
    }

  }

  const dev = {
    dbCredentials: {
      url: getLocalD1()
    }
  }

  return isProd() ? prod : dev
}

export default {
  schema: './drizzle/schema/*.ts',
  out: './drizzle/migrations',
  dialect: "sqlite",
  ...getCredentials()
} satisfies Config;