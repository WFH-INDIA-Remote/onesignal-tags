// Message storage and real-time updates
export interface StoredMessage {
  id: string
  from: string
  to: string
  text: string
  timestamp: string
  type: "text" | "template" | "image" | "document"
  status: "sent" | "delivered" | "read" | "failed"
  isFromUser: boolean
}

export interface StoredContact {
  id: string
  name: string
  phone: string
  lastMessage: string
  timestamp: string
  unreadCount: number
}

// In-memory storage (in production, use a database)
const messages: StoredMessage[] = []
const contacts: StoredContact[] = []
let messageListeners: ((messages: StoredMessage[]) => void)[] = []
let contactListeners: ((contacts: StoredContact[]) => void)[] = []

export function addMessage(message: StoredMessage) {
  console.log("[v0] Adding message to store:", message)
  messages.push(message)

  // Update or create contact
  const existingContactIndex = contacts.findIndex((c) => c.phone === message.from || c.phone === message.to)
  const contactPhone = message.isFromUser ? message.to : message.from

  if (existingContactIndex >= 0) {
    contacts[existingContactIndex] = {
      ...contacts[existingContactIndex],
      lastMessage: message.text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      unreadCount: message.isFromUser
        ? contacts[existingContactIndex].unreadCount
        : contacts[existingContactIndex].unreadCount + 1,
    }
  } else {
    contacts.push({
      id: Date.now().toString(),
      name: `Contact +${contactPhone}`,
      phone: contactPhone,
      lastMessage: message.text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      unreadCount: message.isFromUser ? 0 : 1,
    })
  }

  // Notify listeners
  messageListeners.forEach((listener) => listener([...messages]))
  contactListeners.forEach((listener) => listener([...contacts]))
}

export function getMessages(contactPhone?: string): StoredMessage[] {
  if (contactPhone) {
    return messages.filter((m) => m.from === contactPhone || m.to === contactPhone)
  }
  return [...messages]
}

export function getContacts(): StoredContact[] {
  return [...contacts]
}

export function subscribeToMessages(listener: (messages: StoredMessage[]) => void) {
  messageListeners.push(listener)
  return () => {
    messageListeners = messageListeners.filter((l) => l !== listener)
  }
}

export function subscribeToContacts(listener: (contacts: StoredContact[]) => void) {
  contactListeners.push(listener)
  return () => {
    contactListeners = contactListeners.filter((l) => l !== listener)
  }
}

export function markContactAsRead(contactPhone: string) {
  const contactIndex = contacts.findIndex((c) => c.phone === contactPhone)
  if (contactIndex >= 0) {
    contacts[contactIndex].unreadCount = 0
    contactListeners.forEach((listener) => listener([...contacts]))
  }
}

export function updateMessageStatus(messageId: string, status: "sent" | "delivered" | "read" | "failed") {
  const messageIndex = messages.findIndex((m) => m.id === messageId)
  if (messageIndex >= 0) {
    messages[messageIndex].status = status
    messageListeners.forEach((listener) => listener([...messages]))
  }
}
