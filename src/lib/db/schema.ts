import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

import type { Direction, Ingredient } from '@/types/recipe'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  })
    .notNull()
    .defaultNow(),
})

export const recipes = pgTable('recipes', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id'),
  title: text('title').notNull(),
  summary: text('summary'),
  tags: text('tags').array(),
  tips: text('tips'),
  cookTime: integer('cook_time').default(0),
  servings: integer('servings').default(1),
  imageUrl: text('image_url'),
  source: text('source'),
  isPublic: boolean('is_public').default(true),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
    mode: 'string',
  })
    .notNull()
    .defaultNow(),
  ingredients: jsonb('ingredients').$type<Ingredient[]>().notNull().default([]),
  directions: jsonb('directions').$type<Direction[]>().notNull().default([]),
})

export const bookmarks = pgTable('bookmarks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id'),
  recipeId: uuid('recipe_id'),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  })
    .notNull()
    .defaultNow(),
})

export type UserRow = typeof users.$inferSelect
export type RecipeRow = typeof recipes.$inferSelect
export type BookmarkRow = typeof bookmarks.$inferSelect
