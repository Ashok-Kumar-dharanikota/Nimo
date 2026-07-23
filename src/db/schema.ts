import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

export const journal = sqliteTable("journal", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const journalRelations = relations(journal, ({ many }) => ({
  moments: many(moment),
}));

export const moment = sqliteTable("moment", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  journalId: integer("journal_id")
    .notNull()
    .references(() => journal.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  emotion: text("emotion"),
  title: text("title"),
  mediaUri: text("media_uri"),
  mediaType: text("media_type"),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const momentRelations = relations(moment, ({ one }) => ({
  journal: one(journal, {
    fields: [moment.journalId],
    references: [journal.id],
  }),
}));
