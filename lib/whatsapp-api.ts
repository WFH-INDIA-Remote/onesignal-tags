// WhatsApp Business API configuration and utilities
export const WHATSAPP_CONFIG = {
  phoneNumberId: "766481149883714",
  businessAccountId: "1052392060420311",
  accessToken:
    "EAAcZA6cZBTkW0BPe4FZAZCP9feIjU6q7f7wkfSvQcpbyb6udBmRdyuPF2rIKNJfNoosKdh6bZBrCzE7k1i5biD4FdKRYH1Sft6vfaqnNpdeo9AtlWIArZBFx8Mta9ww4HpjCwBWnKnZAmuMCGaY91alYa9dwgkczvJE3D8v1lOBoeFV2wPQlSc7gi5xZBp7O7AZDZD",
  baseUrl: "https://graph.facebook.com/v22.0",
}

export interface WhatsAppMessage {
  id: string
  from: string
  to: string
  text?: string
  timestamp: string
  type: "text" | "template" | "image" | "document"
  status: "sent" | "delivered" | "read" | "failed"
}

export interface WhatsAppTemplate {
  id: string
  name: string
  category: string
  language: string
  status: "approved" | "pending" | "rejected"
  components: Array<{
    type: string
    text?: string
    buttons?: Array<{
      type: string
      text: string
    }>
  }>
}

// Send a text message
export async function sendWhatsAppMessage(to: string, message: string): Promise<any> {
  const url = `${WHATSAPP_CONFIG.baseUrl}/${WHATSAPP_CONFIG.phoneNumberId}/messages`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WHATSAPP_CONFIG.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: {
        body: message,
      },
    }),
  })

  return response.json()
}

// Send a template message
export async function sendTemplateMessage(to: string, templateName: string, languageCode = "en_US"): Promise<any> {
  const url = `${WHATSAPP_CONFIG.baseUrl}/${WHATSAPP_CONFIG.phoneNumberId}/messages`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WHATSAPP_CONFIG.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: to,
      type: "template",
      template: {
        name: templateName,
        language: {
          code: languageCode,
        },
      },
    }),
  })

  return response.json()
}

// Get message templates
export async function getMessageTemplates(): Promise<WhatsAppTemplate[]> {
  const url = `${WHATSAPP_CONFIG.baseUrl}/${WHATSAPP_CONFIG.businessAccountId}/message_templates`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${WHATSAPP_CONFIG.accessToken}`,
    },
  })

  const data = await response.json()
  return data.data || []
}

// Send an OTP message using the approved wfh_india_otp template
export async function sendOTPMessage(to: string, otp: string): Promise<any> {
  const url = `${WHATSAPP_CONFIG.baseUrl}/${WHATSAPP_CONFIG.phoneNumberId}/messages`

  console.log("[v0] Sending OTP to WhatsApp API:", {
    url,
    to,
    phoneNumberId: WHATSAPP_CONFIG.phoneNumberId,
  })

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_CONFIG.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: to,
        type: "template",
        template: {
          name: "wfh_india_otp",
          language: {
            code: "en",
          },
          components: [
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: otp,
                },
              ],
            },
            {
              type: "button",
              sub_type: "url",
              index: "0",
              parameters: [
                {
                  type: "text",
                  text: otp,
                },
              ],
            },
          ],
        },
      }),
    })

    const result = await response.json()

    console.log("[v0] WhatsApp API Response Status:", response.status)
    console.log("[v0] WhatsApp API Response Body:", result)

    if (!response.ok) {
      console.error("[v0] WhatsApp API Error Response:", result)
    }

    return result
  } catch (error) {
    console.error("[v0] Network error sending OTP:", error)
    throw error
  }
}

// Get phone number info
export async function getPhoneNumberInfo(): Promise<any> {
  const url = `${WHATSAPP_CONFIG.baseUrl}/${WHATSAPP_CONFIG.phoneNumberId}`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${WHATSAPP_CONFIG.accessToken}`,
    },
  })

  return response.json()
}

// Mark messages as read
export async function markMessageAsRead(messageId: string): Promise<any> {
  const url = `${WHATSAPP_CONFIG.baseUrl}/${WHATSAPP_CONFIG.phoneNumberId}/messages`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WHATSAPP_CONFIG.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      status: "read",
      message_id: messageId,
    }),
  })

  return response.json()
}

// Webhook verification for receiving messages
export function verifyWebhook(mode: string, token: string, challenge: string): string | null {
  const VERIFY_TOKEN = "whatsapp_business_verify_token_2024"

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return challenge
  }
  return null
}

// Process incoming webhook messages
export function processWebhookMessage(body: any): WhatsAppMessage[] {
  const messages: WhatsAppMessage[] = []

  if (body.object === "whatsapp_business_account") {
    body.entry?.forEach((entry: any) => {
      entry.changes?.forEach((change: any) => {
        if (change.field === "messages") {
          change.value?.messages?.forEach((message: any) => {
            messages.push({
              id: message.id,
              from: message.from,
              to: change.value.metadata.phone_number_id,
              text: message.text?.body || "",
              timestamp: new Date(Number.parseInt(message.timestamp) * 1000).toISOString(),
              type: message.type,
              status: "delivered",
            })
          })
        }
      })
    })
  }

  return messages
}
