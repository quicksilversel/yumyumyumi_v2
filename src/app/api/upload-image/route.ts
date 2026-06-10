import { del, put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string
    const recipeId = formData.get('recipeId') as string

    if (!file || !userId || !recipeId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size must be less than 2MB' },
        { status: 400 },
      )
    }

    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const fileName = `recipe-images/${userId}_${recipeId}_${timestamp}_${randomString}.webp`

    const blob = await put(fileName, file, {
      access: 'public',
      contentType: file.type || 'image/webp',
    })

    return NextResponse.json({
      url: blob.url,
      success: true,
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Server upload error:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to upload image',
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { url } = await request.json()
    if (!url) {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 })
    }

    await del(url)

    return NextResponse.json({ success: true })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Server delete error:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to delete image',
      },
      { status: 500 },
    )
  }
}
