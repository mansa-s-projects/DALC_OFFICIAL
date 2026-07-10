import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createRouteHandlerClient({ cookies })

// GET: Fetch single request (for real-time subscription setup)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: req, error } = await supabase
      .from('requests')
      .select(`
        *,
        user:user_id(id, email, full_name, phone),
        assigned_concierge:assigned_to(id, full_name, email),
        payments(id, amount_aed, stripe_status, payment_type),
        request_status_log(status, created_at, updated_by) order by created_at desc
      `)
      .eq('id', params.id)
      .single()

    if (error) throw error

    return NextResponse.json(req)
  } catch (err) {
    console.error('GET request error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch request' },
      { status: 500 }
    )
  }
}

// PATCH: Update request status (concierge only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Verify concierge role
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'concierge' && profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { status, assigned_to, quote_amount, quote_notes, internal_notes } = body

    // Update request
    const { data: updatedRequest, error: updateError } = await supabase
      .from('requests')
      .update({
        status,
        assigned_to: assigned_to || null,
        internal_notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (updateError) throw updateError

    // Log status change
    await supabase
      .from('request_status_log')
      .insert({
        request_id: params.id,
        status,
        updated_by: session.user.id,
        created_at: new Date().toISOString(),
      })

    // If quote generated, create quote record
    if (status === 'quoted' && quote_amount) {
      const { error: quoteError } = await supabase
        .from('quotes')
        .insert({
          request_id: params.id,
          amount_aed: quote_amount,
          notes: quote_notes,
          valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          created_by: session.user.id,
        })

      if (quoteError) console.error('Quote creation error:', quoteError)
    }

    // TRIGGER NOTIFICATIONS (see Step 2)
    await triggerNotification({
      request_id: params.id,
      status,
      user_id: updatedRequest.user_id,
      contact_info: updatedRequest.contact_info,
    })

    return NextResponse.json(updatedRequest)
  } catch (err) {
    console.error('PATCH request error:', err)
    return NextResponse.json(
      { error: 'Failed to update request' },
      { status: 500 }
    )
  }
}

// Helper: Trigger notifications
async function triggerNotification({
  request_id,
  status,
  user_id,
  contact_info,
}: {
  request_id: string
  status: string
  user_id: string
  contact_info: string
}) {
  const supabase = createRouteHandlerClient({ cookies })

  const messages = {
    assigned: {
      sms: 'Your DALC request has been assigned to a concierge. We\'ll follow up soon.',
      title: 'Request Assigned',
    },
    quoted: {
      sms: 'Your quote is ready! Check DALC app to review and pay.',
      title: 'Quote Ready',
    },
    confirmed: {
      sms: 'Confirmed! Your booking is set. See you soon.',
      title: 'Booking Confirmed',
    },
    completed: {
      sms: 'Done! Thanks for choosing DALC. See you next time.',
      title: 'Booking Completed',
    },
  }

  const msg = messages[status as keyof typeof messages]
  if (!msg) return

  // Store in-app notification
  await supabase
    .from('notifications')
    .insert({
      user_id,
      title: msg.title,
      message: msg.sms,
      type: 'request_update',
      request_id,
      read: false,
    })
    .catch(err => console.error('Notification insert error:', err))

  // Queue SMS (see Step 2 for full implementation)
  // For now: log to console
  console.log(`📱 SMS to ${contact_info}: ${msg.sms}`)
}