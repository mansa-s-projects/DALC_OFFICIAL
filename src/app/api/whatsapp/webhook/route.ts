import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Webhook to receive incoming WhatsApp messages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { from, body: messageBody, timestamp } = body

    // Parse incoming message
    // Example: "Book hotel in Dubai for 2 people, Jan 15-20"
    const requestData = parseWhatsAppRequest(messageBody)

    // Look up existing profile by phone
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('phone', from)
      .single()

    const userId = existingProfile?.id ?? null

    // Insert request (no user_id if profile not found — staff can match later)
    const { data: newRequest, error: requestError } = await supabase
      .from('requests')
      .insert({
        user_id: userId,
        category: requestData.category,
        request_type: 'booking',
        venue_name: requestData.title,
        notes: messageBody,
        contact_info: from,
        status: 'submitted',
      })
      .select('id')
      .single()

    if (requestError) throw requestError

    // Acknowledge to WhatsApp
    await sendWhatsAppMessage(from, `✅ Got it! We received your request for *${requestData.title}*. Our concierge will follow up within 1 hour.`)

    return NextResponse.json({ success: true, requestId: newRequest.id })
  } catch (err) {
    console.error('WhatsApp webhook error:', err)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}

// Verify webhook (Twilio/MessageBird will call this to verify)
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('hub.verify_token')
  if (token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return NextResponse.json(request.nextUrl.searchParams.get('hub.challenge'))
  }
  return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
}

// Helper: Parse WhatsApp message intent
function parseWhatsAppRequest(message: string) {
  // Simple keyword matching (upgrade to Claude API for real NLP later)
  const lowerMsg = message.toLowerCase()

  if (lowerMsg.includes('hotel') || lowerMsg.includes('stay')) {
    return { category: 'stays', title: 'Hotel booking request' }
  } else if (lowerMsg.includes('car') || lowerMsg.includes('rent')) {
    return { category: 'transport', title: 'Car rental request' }
  } else if (lowerMsg.includes('yacht')) {
    return { category: 'transport', title: 'Yacht charter request' }
  } else if (lowerMsg.includes('visa') || lowerMsg.includes('setup')) {
    return { category: 'business', title: 'Visa/business setup request' }
  } else {
    return { category: 'concierge', title: 'Custom concierge request' }
  }
}

// Helper: Send WhatsApp message (stub - use Twilio/MessageBird SDK)
async function sendWhatsAppMessage(phone: string, message: string) {
  console.log(`📲 WhatsApp to ${phone}: ${message}`)
  // TODO: Implement actual WhatsApp API call
}
