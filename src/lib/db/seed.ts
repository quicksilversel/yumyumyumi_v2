/**
 * Seeds the Neon database with data rescued from the old Supabase backup.
 *
 * Run with:  npm run db:seed
 * Requires in .env.local:  DATABASE_URL, SEED_EMAIL, SEED_PASSWORD
 *
 * Re-running is safe: rows are upserted by primary key.
 */
/* eslint-disable no-console */
import { readFileSync } from 'fs'
import { join } from 'path'

import bcrypt from 'bcryptjs'

import { bookmarks, recipes, users } from './schema'

import { db } from './index'

// The account UUID from the original Supabase auth.users — kept identical so the
// rescued recipes.user_id / bookmarks.user_id keep pointing at the same owner.
const OWNER_ID = 'ac8f5cfe-a34f-44b6-a8ea-66aff226baa3'

// The 4 bookmarks rescued from the backup.
const SEED_BOOKMARKS = [
  {
    id: '862c7fb3-c019-4e88-b670-57f67ecc6be5',
    recipeId: 'a6c75c91-6fdb-4d75-abaf-af96695164fb',
    createdAt: '2025-09-11 00:56:13.4017+00',
  },
  {
    id: '1998f021-5c07-4474-a5ae-6490179f38f5',
    recipeId: '68b4766e-5cb2-487e-a23a-fd82cc41a0d2',
    createdAt: '2025-09-11 01:21:29.462523+00',
  },
  {
    id: '4fb6f72b-62b8-4aae-9601-e1ac7d53c332',
    recipeId: '9b854160-91ec-419e-ae36-fd762aaf2646',
    createdAt: '2025-09-11 01:30:06.044922+00',
  },
  {
    id: '32c4f12e-d709-4a43-9b7c-3ddc32432059',
    recipeId: '8002f732-429b-41ad-b9fb-352787093e1d',
    createdAt: '2025-09-11 01:43:35.148844+00',
  },
]

type ExportedRecipe = {
  id: string
  user_id: string
  title: string
  summary: string | null
  tags: string[]
  tips: string | null
  cook_time: number
  servings: number
  image_url: string | null
  source: string | null
  is_public: boolean
  created_at: string
  updated_at: string
  ingredients: unknown
  directions: unknown
}

async function main() {
  const { SEED_EMAIL, SEED_PASSWORD } = process.env
  if (!SEED_EMAIL || !SEED_PASSWORD) {
    throw new Error(
      'Set SEED_EMAIL and SEED_PASSWORD in .env.local before seeding.',
    )
  }

  // 1. Owner account
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10)
  await db
    .insert(users)
    .values({ id: OWNER_ID, email: SEED_EMAIL, passwordHash })
    .onConflictDoUpdate({
      target: users.id,
      set: { email: SEED_EMAIL, passwordHash },
    })
  console.log(`✓ Seeded owner account (${SEED_EMAIL})`)

  // 2. Recipes (image_url nulled — original blobs are unrecoverable)
  const file = join(process.cwd(), 'data-export', 'recipes_export.json')
  const exported: ExportedRecipe[] = JSON.parse(readFileSync(file, 'utf-8'))

  for (const r of exported) {
    const row = {
      id: r.id,
      userId: r.user_id,
      title: r.title,
      // empty optional text is stored as '' (not null) to match the schema
      summary: r.summary ?? '',
      tags: r.tags,
      tips: r.tips ?? '',
      cookTime: r.cook_time,
      servings: r.servings,
      // original image blobs are unrecoverable — store '' so the no-image fallback shows
      imageUrl: '',
      source: r.source ?? '',
      isPublic: r.is_public,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      // jsonb stored as-is (nested keys stay snake_case, matching the read path)
      ingredients: r.ingredients as never,
      directions: r.directions as never,
    }
    await db
      .insert(recipes)
      .values(row)
      .onConflictDoUpdate({ target: recipes.id, set: row })
  }
  console.log(`✓ Seeded ${exported.length} recipes`)

  // 3. Bookmarks
  for (const b of SEED_BOOKMARKS) {
    await db
      .insert(bookmarks)
      .values({
        id: b.id,
        userId: OWNER_ID,
        recipeId: b.recipeId,
        createdAt: b.createdAt,
      })
      .onConflictDoNothing({ target: bookmarks.id })
  }
  console.log(`✓ Seeded ${SEED_BOOKMARKS.length} bookmarks`)

  console.log('Done.')
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
