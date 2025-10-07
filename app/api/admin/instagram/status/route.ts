import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { upsertInstagramToken, getInstagramToken } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('POST status: Received token storage request')

    const cookieStore = await cookies()
    const authCookie = cookieStore.get('admin-auth')

    if (authCookie?.value !== 'authenticated') {
      console.log('POST status: Not authenticated')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('POST status: Request body received:', { userId: body.userId, hasAccessToken: !!body.accessToken })

    const { accessToken, userId } = body

    // Store tokens in database
    console.log('POST status: Calling upsertInstagramToken...')
    const result = await upsertInstagramToken(accessToken, userId)
    console.log('POST status: Upsert result:', result ? { id: result.id, user_id: result.user_id } : 'none')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Status POST error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const authCookie = cookieStore.get('admin-auth')

    if (authCookie?.value !== 'authenticated') {
      console.log('GET status: Not authenticated')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('GET status: Fetching token from database...')
    const token = await getInstagramToken()
    console.log('GET status: Token from DB:', token ? { id: token.id, user_id: token.user_id, created_at: token.created_at } : null)

    if (!token) {
      console.log('GET status: No token found')
      return NextResponse.json({ connected: false })
    }

    // Check if token is older than 60 days
    const sixtyDays = 60 * 24 * 60 * 60 * 1000
    const tokenAge = Date.now() - new Date(token.created_at).getTime()

    console.log('GET status: Token age (days):', tokenAge / (24 * 60 * 60 * 1000))

    if (tokenAge > sixtyDays) {
      console.log('GET status: Token expired')
      return NextResponse.json({ connected: false })
    }

    console.log('GET status: Returning connected=true')
    return NextResponse.json({
      connected: true,
      userId: token.user_id,
      accessToken: token.access_token,
    })
  } catch (error) {
    console.error('Status GET error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
