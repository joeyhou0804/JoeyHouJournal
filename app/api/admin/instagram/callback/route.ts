import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { upsertInstagramToken } from '@/lib/db'

export const dynamic = 'force-dynamic'

const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET
const INSTAGRAM_REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const errorReason = searchParams.get('error_reason')
    const errorDescription = searchParams.get('error_description')

    // Handle user denial or errors
    if (error) {
      console.error('Instagram OAuth error:', { error, errorReason, errorDescription })
      return NextResponse.redirect(
        new URL(`/admin/instagram-import?error=${encodeURIComponent(errorDescription || 'Authorization failed')}`, request.url)
      )
    }

    if (!code) {
      return NextResponse.json({ error: 'No authorization code received' }, { status: 400 })
    }

    // Exchange code for short-lived access token via Facebook Graph API
    console.log('Token exchange redirect_uri:', INSTAGRAM_REDIRECT_URI)
    const tokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${encodeURIComponent(INSTAGRAM_REDIRECT_URI!)}&client_secret=${INSTAGRAM_APP_SECRET}&code=${code}`

    const tokenResponse = await fetch(tokenUrl)

    const tokenData = await tokenResponse.json()

    console.log('Token response:', { ok: tokenResponse.ok, data: tokenData })

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('Token exchange failed:', tokenData)
      return NextResponse.json({ error: 'Failed to obtain access token', details: tokenData }, { status: 400 })
    }

    console.log('Access token obtained successfully')

    // Get Facebook Pages connected to this user
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${tokenData.access_token}`
    )
    const pagesData = await pagesResponse.json()

    console.log('Pages response:', pagesData)

    if (!pagesData.data || pagesData.data.length === 0) {
      return NextResponse.json(
        { error: 'No Facebook Pages found. Please connect your Instagram account to a Facebook Page first.' },
        { status: 400 }
      )
    }

    // Get Instagram Business Account ID from the first page
    const pageId = pagesData.data[0].id
    const pageAccessToken = pagesData.data[0].access_token

    const igAccountResponse = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`
    )
    const igAccountData = await igAccountResponse.json()

    console.log('Instagram account data:', igAccountData)

    if (!igAccountData.instagram_business_account) {
      return NextResponse.json(
        { error: 'No Instagram Business Account found connected to your Facebook Page.' },
        { status: 400 }
      )
    }

    const instagramAccountId = igAccountData.instagram_business_account.id

    console.log('Instagram connection successful:', { instagramAccountId })

    // Store tokens directly in database
    try {
      console.log('Storing tokens in database...')
      const result = await upsertInstagramToken(pageAccessToken, instagramAccountId)
      console.log('Tokens stored successfully:', result ? { id: result.id, user_id: result.user_id } : 'none')
    } catch (error) {
      console.error('Failed to store tokens in database:', error)
      return NextResponse.json(
        { error: 'Failed to store Instagram tokens', details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      )
    }

    // Redirect using NextResponse.redirect
    return NextResponse.redirect(new URL('/admin/instagram-import?connected=true', request.url))
  } catch (error) {
    console.error('Instagram OAuth callback error:', error)
    return NextResponse.json(
      { error: 'Server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
