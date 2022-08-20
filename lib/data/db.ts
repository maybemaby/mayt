import { PrismaClient } from "@prisma/client";

declare global {
  // allow global `var` declarations

  // eslint-disable-next-line no-var

  var db: PrismaClient | undefined;
}

const db =
  global.db ||
  new PrismaClient({
    errorFormat: "pretty",
  });

if (process.env.NODE_ENV !== "production") global.db = db;

export default db;
