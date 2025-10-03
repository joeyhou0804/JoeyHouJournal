import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verificationCodes } from './verification-store'
import twilio from 'twilio'

export const dynamic = 'force-dynamic'

const ADMIN_PHONE = process.env.ADMIN_PHONE || '+16462430124'
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code || code.length !== 4 && code.length !== 6) {
      return NextResponse.json({ error: 'Invalid code format' }, { status: 400 })
    }

    let verified = false

    // If using Twilio Verify API
    if (TWILIO_VERIFY_SERVICE_SID && TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
      try {
        const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        const verificationCheck = await client.verify.v2
          .services(TWILIO_VERIFY_SERVICE_SID)
          .verificationChecks.create({
            to: ADMIN_PHONE,
            code: code
          })

        console.log('Twilio Verify check:', verificationCheck.status)
        verified = verificationCheck.status === 'approved'
      } catch (error: any) {
        console.error('Twilio Verify check error:', error)
        return NextResponse.json({ error: 'Invalid verification code' }, { status: 401 })
      }
    } else {
      // Fallback: Check local stored code
      const stored = verificationCodes.get(ADMIN_PHONE)

      if (!stored) {
        return NextResponse.json({ error: 'No verification code found. Please request a new code.' }, { status: 401 })
      }

      // Check if code is expired
      if (stored.expiresAt < Date.now()) {
        verificationCodes.delete(ADMIN_PHONE)
        return NextResponse.json({ error: 'Verification code expired. Please request a new code.' }, { status: 401 })
      }

      // Verify the code
      if (code === stored.code) {
        verified = true
        verificationCodes.delete(ADMIN_PHONE)
      }
    }

    if (verified) {
      // Set a secure HTTP-only cookie
      const cookieStore = await cookies()
      cookieStore.set('admin-auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 24 hours
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid verification code' }, { status: 401 })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Server error', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const authCookie = cookieStore.get('admin-auth')

    if (authCookie?.value === 'authenticated') {
      return NextResponse.json({ authenticated: true })
    }

    return NextResponse.json({ authenticated: false }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('admin-auth')
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
