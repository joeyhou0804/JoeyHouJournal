import { NextResponse } from 'next/server'
import twilio from 'twilio'

export const dynamic = 'force-dynamic'

const ADMIN_PHONE = process.env.ADMIN_PHONE || '+16462430124'
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER

export async function GET() {
  try {
    // Check if all credentials are present
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      return NextResponse.json({
        error: 'Missing Twilio credentials',
        details: {
          hasSID: !!TWILIO_ACCOUNT_SID,
          hasToken: !!TWILIO_AUTH_TOKEN,
          hasPhoneNumber: !!TWILIO_PHONE_NUMBER
        }
      }, { status: 500 })
    }

    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

    // Test sending a message
    const message = await client.messages.create({
      body: 'Test message from Joey Hou Journal admin system',
      from: TWILIO_PHONE_NUMBER,
      to: ADMIN_PHONE
    })

    return NextResponse.json({
      success: true,
      message: 'Test message sent',
      details: {
        messageSid: message.sid,
        status: message.status,
        to: ADMIN_PHONE,
        from: TWILIO_PHONE_NUMBER
      }
    })
  } catch (error: any) {
    console.error('Twilio test error:', error)
    return NextResponse.json({
      error: 'Twilio error',
      details: {
        message: error.message,
        code: error.code,
        moreInfo: error.moreInfo
      }
    }, { status: 500 })
  }
}
