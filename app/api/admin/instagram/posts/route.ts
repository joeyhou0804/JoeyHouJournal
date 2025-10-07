import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

interface InstagramMediaResponse {
  data: Array<{
    id: string
    caption?: string
    media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
    media_url?: string
    thumbnail_url?: string
    timestamp: string
    permalink: string
    children?: {
      data: Array<{
        id: string
        media_url: string
        media_type: string
      }>
    }
  }>
  paging?: {
    cursors: {
      before: string
      after: string
    }
    next?: string
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const cookieStore = await cookies()
    const authCookie = cookieStore.get('admin-auth')

    if (authCookie?.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get Instagram access token from status endpoint
    const adminAuthCookie = cookieStore.get('admin-auth')
    const statusResponse = await fetch(new URL('/api/admin/instagram/status', request.url).toString(), {
      headers: {
        'Cookie': `admin-auth=${adminAuthCookie?.value}`,
      },
    })

    const statusData = await statusResponse.json()
    console.log('Posts: Status data received:', {
      connected: statusData.connected,
      hasAccessToken: !!statusData.accessToken,
      hasUserId: !!statusData.userId,
      userId: statusData.userId
    })

    if (!statusData.connected || !statusData.accessToken || !statusData.userId) {
      console.log('Posts: Instagram not connected')
      return NextResponse.json({ error: 'Instagram not connected' }, { status: 401 })
    }

    const accessToken = statusData.accessToken
    const userId = statusData.userId
    console.log('Posts: Using accessToken (first 20 chars):', accessToken.substring(0, 20))

    // Get pagination cursor from query params
    const searchParams = request.nextUrl.searchParams
    const after = searchParams.get('after')
    const limit = searchParams.get('limit') || '25'

    // Fetch media from Instagram Graph API (via Facebook Graph API)
    const fields = 'id,caption,media_type,media_url,thumbnail_url,timestamp,permalink,children{media_url,media_type}'
    let url = `https://graph.facebook.com/v18.0/${userId}/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`

    if (after) {
      url += `&after=${after}`
    }

    console.log('Posts: Fetching from Instagram API, userId:', userId)
    const response = await fetch(url)
    const data: InstagramMediaResponse = await response.json()
    console.log('Posts: Instagram API response:', { ok: response.ok, status: response.status, dataKeys: Object.keys(data) })

    if (!response.ok) {
      console.error('Instagram API error:', data)

      // Check if token expired
      if (response.status === 401 || response.status === 400) {
        // Clear invalid token
        cookieStore.delete('instagram-access-token')
        cookieStore.delete('instagram-user-id')
        return NextResponse.json({ error: 'Instagram token expired. Please reconnect.' }, { status: 401 })
      }

      return NextResponse.json({ error: 'Failed to fetch Instagram posts', details: data }, { status: response.status })
    }

    // Transform the data to a cleaner format
    const posts = data.data.map(post => ({
      id: post.id,
      caption: post.caption || '',
      mediaType: post.media_type,
      mediaUrl: post.media_url || post.thumbnail_url,
      timestamp: post.timestamp,
      permalink: post.permalink,
      // For carousel albums, include all child media
      childMedia: post.children?.data.map(child => ({
        id: child.id,
        mediaUrl: child.media_url,
        mediaType: child.media_type,
      })) || [],
    }))

    return NextResponse.json({
      posts,
      paging: data.paging,
    })
  } catch (error) {
    console.error('Instagram posts fetch error:', error)
    return NextResponse.json(
      { error: 'Server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
