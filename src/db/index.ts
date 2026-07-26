import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "./schema";

export const expoDb = openDatabaseSync("nimo.db", { enableChangeListener: true });

// Manual migrations removed. Drizzle migrator will handle this.

export const db = drizzle(expoDb, { schema });

