import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

export const journal = sqliteTable("journal", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  syncId: text("sync_id"),
  title: text("title").notNull(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  deletedAt: text("deleted_at"),
});

export const journalRelations = relations(journal, ({ many }) => ({
  moments: many(moment),
}));

export const moment = sqliteTable("moment", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  syncId: text("sync_id"),
  journalId: integer("journal_id")
    .notNull()
    .references(() => journal.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  emotion: text("emotion"),
  title: text("title"),
  mediaUri: text("media_uri"),
  mediaType: text("media_type"),
  isDraft: integer("is_draft", { mode: "boolean" }).default(false).notNull(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  deletedAt: text("deleted_at"),
});

export const momentRelations = relations(moment, ({ one }) => ({
  journal: one(journal, {
    fields: [moment.journalId],
    references: [journal.id],
  }),
}));

export const dailyTask = sqliteTable("daily_task", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  isCompleted: integer("is_completed", { mode: "boolean" }).default(false).notNull(),
  dateStr: text("date_str").notNull(), // format YYYY-MM-DD
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});
