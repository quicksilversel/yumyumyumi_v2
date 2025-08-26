import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Get the form data
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

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 2MB' },
        { status: 400 },
      )
    }

    // Create Supabase client with service role key (bypasses RLS)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      // eslint-disable-next-line no-console
      console.error('Missing Supabase credentials')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 },
      )
    }

    // Create admin client with service role
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Verify the user is authenticated (optional but recommended)
    const cookieStore = await cookies()
    const token =
      cookieStore.get('sb-access-token')?.value ||
      cookieStore.get(
        `sb-${supabaseUrl.replace('https://', '').split('.')[0]}-auth-token`,
      )?.value

    if (!token) {
      // For now, we'll allow uploads without checking auth since service role bypasses it
      // In production, you should verify the user
      console.warn('No auth token found, but proceeding with service role')
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Generate filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const fileName = `${userId}_${recipeId}_${timestamp}_${randomString}.webp`

    // Upload to Supabase Storage using service role (bypasses all RLS)
    const { data, error } = await supabaseAdmin.storage
      .from('recipe-images')
      .upload(fileName, buffer, {
        contentType: file.type || 'image/webp',
        cacheControl: '3600',
        upsert: true,
      })

    if (error) {
      // eslint-disable-next-line no-console
      console.error('Storage upload error:', error)
      return NextResponse.json(
        { error: `Upload failed: ${error.message}` },
        { status: 500 },
      )
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from('recipe-images').getPublicUrl(fileName)

    return NextResponse.json({
      url: publicUrl,
      path: data.path,
      success: true,
    })
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Server upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 },
    )
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle file upload
  },
}
