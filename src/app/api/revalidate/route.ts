import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record?: Record<string, any>
  old_record?: Record<string, any>
  schema: string
}

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = request.headers.get('x-webhook-secret')

    if (!process.env.SUPABASE_WEBHOOK_SECRET) {
      // eslint-disable-next-line no-console
      console.error('SUPABASE_WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 },
      )
    }

    if (webhookSecret !== process.env.SUPABASE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload: WebhookPayload = await request.json()

    switch (payload.table) {
      case 'recipes':
        revalidatePath('/')

        if (payload.record?.id || payload.old_record?.id) {
          const recipeId = payload.record?.id || payload.old_record?.id
          revalidatePath(`/recipes/${recipeId}`)
        }

        revalidatePath('/recipes/[id]', 'page')
        revalidateTag('recipes')
        revalidateTag('recipes-list')

        break

      case 'bookmarks':
        revalidateTag('bookmarks')

        if (payload.record?.recipe_id) {
          revalidatePath(`/recipes/${payload.record.recipe_id}`)
        }

        break

      default:
        // eslint-disable-next-line no-console
        console.log('No revalidation rules for table:', payload.table)
    }

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      table: payload.table,
      type: payload.type,
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Revalidation endpoint is active',
  })
}
