import { type NextRequest, NextResponse } from "next/server"
import { verifyWebhook, processWebhookMessage } from "@/lib/whatsapp-api"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get("hub.mode")
  const token = searchParams.get("hub.verify_token")
  const challenge = searchParams.get("hub.challenge")

  if (mode && token && challenge) {
    const verifiedChallenge = verifyWebhook(mode, token, challenge)
    if (verifiedChallenge) {
      return new NextResponse(verifiedChallenge, { status: 200 })
    }
  }

  return new NextResponse("Forbidden", { status: 403 })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[v0] Webhook received:", JSON.stringify(body, null, 2))

    const messages = processWebhookMessage(body)

    if (messages.length > 0) {
      const { addMessage } = await import("@/lib/message-store")

      messages.forEach((message) => {
        const storedMessage = {
          id: message.id,
          from: message.from,
          to: message.to,
          text: message.text || "",
          timestamp: message.timestamp,
          type: message.type as "text" | "template" | "image" | "document",
          status: message.status as "sent" | "delivered" | "read" | "failed",
          isFromUser: false,
        }

        addMessage(storedMessage)
        console.log("[v0] Stored incoming message:", storedMessage)
      })
    }

    if (body.entry) {
      body.entry.forEach((entry: any) => {
        entry.changes?.forEach((change: any) => {
          if (change.field === "messages" && change.value?.statuses) {
            change.value.statuses.forEach(async (status: any) => {
              const { updateMessageStatus } = await import("@/lib/message-store")
              console.log("[v0] Message status update:", status)
              updateMessageStatus(status.id, status.status)
            })
          }
        })
      })
    }

    return NextResponse.json({ status: "ok" })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
