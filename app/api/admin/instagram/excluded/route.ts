import { NextResponse } from 'next/server'
import { getAllExcludedPostIds, excludeInstagramPost, unexcludeInstagramPost } from '@/lib/db'

// GET - Get all excluded post IDs
export async function GET() {
  try {
    const excludedPostIds = await getAllExcludedPostIds()
    return NextResponse.json({ excludedPostIds })
  } catch (error) {
    console.error('Error fetching excluded posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch excluded posts' },
      { status: 500 }
    )
  }
}

// POST - Exclude a post
export async function POST(request: Request) {
  try {
    const { instagramPostId } = await request.json()

    if (!instagramPostId) {
      return NextResponse.json(
        { error: 'Instagram post ID is required' },
        { status: 400 }
      )
    }

    const success = await excludeInstagramPost(instagramPostId)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to exclude post' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error excluding post:', error)
    return NextResponse.json(
      { error: 'Failed to exclude post' },
      { status: 500 }
    )
  }
}

// DELETE - Unexclude a post
export async function DELETE(request: Request) {
  try {
    const { instagramPostId } = await request.json()

    if (!instagramPostId) {
      return NextResponse.json(
        { error: 'Instagram post ID is required' },
        { status: 400 }
      )
    }

    const success = await unexcludeInstagramPost(instagramPostId)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to unexclude post' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error unexcluding post:', error)
    return NextResponse.json(
      { error: 'Failed to unexclude post' },
      { status: 500 }
    )
  }
}
