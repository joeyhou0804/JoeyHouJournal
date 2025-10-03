import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'
import { verificationCodes } from '../verification-store'

export const dynamic = 'force-dynamic'

const ADMIN_PHONE = process.env.ADMIN_PHONE || '+16462430124'
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID

export async function POST(request: NextRequest) {
  try {
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
      return NextResponse.json(
        { error: 'Twilio credentials not configured' },
        { status: 500 }
      )
    }

    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

    // If Verify Service is configured, use Twilio Verify API
    if (TWILIO_VERIFY_SERVICE_SID) {
      try {
        const verification = await client.verify.v2
          .services(TWILIO_VERIFY_SERVICE_SID)
          .verifications.create({
            to: ADMIN_PHONE,
            channel: 'sms'
          })

        console.log('Twilio Verify code sent:', verification.sid, verification.status)

        return NextResponse.json({
          success: true,
          message: 'Verification code sent to your phone',
          phoneLast4: ADMIN_PHONE.slice(-4),
          usingVerifyAPI: true
        })
      } catch (error: any) {
        console.error('Twilio Verify error:', error)
        return NextResponse.json(
          {
            error: 'Failed to send verification code via Twilio Verify',
            details: error.message
          },
          { status: 500 }
        )
      }
    }

    // Fallback: Generate and store code locally (for dev mode only)
    const code = Math.floor(1000 + Math.random() * 9000).toString()
    const expiresAt = Date.now() + 5 * 60 * 1000
    verificationCodes.set(ADMIN_PHONE, { code, expiresAt })

    // Clean up expired codes
    for (const [phone, data] of verificationCodes.entries()) {
      if (data.expiresAt < Date.now()) {
        verificationCodes.delete(phone)
      }
    }

    console.log(`Dev mode: Verification code ${code} for ${ADMIN_PHONE}`)

    return NextResponse.json({
      success: true,
      message: 'Verification code generated (dev mode - check console)',
      phoneLast4: ADMIN_PHONE.slice(-4),
      usingVerifyAPI: false,
      // In development mode, return the code
      ...(process.env.NODE_ENV === 'development' && { debugCode: code })
    })
  } catch (error) {
    console.error('Error sending verification code:', error)
    return NextResponse.json(
      {
        error: 'Failed to send verification code',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
