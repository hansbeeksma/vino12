import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email } = await request.json()

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'Ongeldig e-mailadres' }, { status: 400 })
  }

  // TODO: Integrate with Resend audience API
  // For now, log and return success
  console.log('[Newsletter] New signup:', email)

  return NextResponse.json({ success: true })
}
