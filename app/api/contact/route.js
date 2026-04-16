import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { sendContactNotification } from '@/lib/email'

export async function POST(request) {
  try {
    const { name, email, phone, message, machineId } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nom, email et message sont requis' },
        { status: 400 }
      )
    }

    const session = await getSession()

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
        machineId: machineId || null,
        userId: session?.id || null,
      },
    })

    // Send email notification (non-blocking)
    sendContactNotification({ name, email, phone, message, machineId }).catch(err =>
      console.error('Email notification failed:', err.message)
    )

    return NextResponse.json({ success: true, contact }, { status: 201 })
  } catch (error) {
    console.error('Contact POST error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const contacts = await prisma.contact.findMany({
      include: { machine: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ contacts })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
