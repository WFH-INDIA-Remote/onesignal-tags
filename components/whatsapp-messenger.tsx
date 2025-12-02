"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send, Search, Phone, MoreVertical, Clock, CheckCheck, Check, User, MessageCircle, Plus } from "lucide-react"
import { sendWhatsAppMessage } from "@/lib/whatsapp-api"
import {
  addMessage,
  getMessages,
  getContacts,
  subscribeToMessages,
  subscribeToContacts,
  markContactAsRead,
} from "@/lib/message-store"

interface Message {
  id: string
  text: string
  timestamp: string
  isFromUser: boolean
  status: "sent" | "delivered" | "read"
}

interface Contact {
  id: string
  name: string
  phone: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  avatar?: string
}

interface WhatsAppMessengerProps {
  phoneNumber: string
  onStatsUpdate: (stats: any) => void
}

export function WhatsAppMessenger({ phoneNumber, onStatsUpdate }: WhatsAppMessengerProps) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [newContactPhone, setNewContactPhone] = useState("")
  const [showNewContact, setShowNewContact] = useState(false)
  const [error, setError] = useState("")

  const [contacts, setContacts] = useState<Contact[]>([])
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const initialContacts = getContacts()
    if (initialContacts.length === 0) {
      const testContact = {
        id: "test",
        name: "Test Contact",
        phone: phoneNumber,
        lastMessage: "Start a conversation...",
        timestamp: "now",
        unreadCount: 0,
      }
      setContacts([testContact])
    } else {
      setContacts(
        initialContacts.map((c) => ({
          id: c.id,
          name: c.name,
          phone: c.phone,
          lastMessage: c.lastMessage,
          timestamp: c.timestamp,
          unreadCount: c.unreadCount,
        })),
      )
    }

    const unsubscribeContacts = subscribeToContacts((updatedContacts) => {
      console.log("[v0] Contacts updated:", updatedContacts)
      setContacts(
        updatedContacts.map((c) => ({
          id: c.id,
          name: c.name,
          phone: c.phone,
          lastMessage: c.lastMessage,
          timestamp: c.timestamp,
          unreadCount: c.unreadCount,
        })),
      )
    })

    const unsubscribeMessages = subscribeToMessages((updatedMessages) => {
      console.log("[v0] Messages updated:", updatedMessages)
      if (selectedContact) {
        const contactMessages = updatedMessages
          .filter((m) => m.from === selectedContact.phone || m.to === selectedContact.phone)
          .map((m) => ({
            id: m.id,
            text: m.text,
            timestamp: new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isFromUser: m.isFromUser,
            status: m.status,
          }))
        setMessages(contactMessages)
      }
    })

    return () => {
      unsubscribeContacts()
      unsubscribeMessages()
    }
  }, [phoneNumber, selectedContact])

  useEffect(() => {
    const totalMessages = messages.length
    const sentMessages = messages.filter((m) => m.isFromUser).length
    const deliveredMessages = messages.filter((m) => m.status === "delivered" || m.status === "read").length
    const readMessages = messages.filter((m) => m.status === "read").length

    onStatsUpdate({
      totalMessages: sentMessages,
      messagesDelivered: deliveredMessages,
      messagesRead: readMessages,
      activeChats: contacts.filter((c) => c.unreadCount > 0 || c.lastMessage !== "Start a conversation...").length,
      responseTime: "2.5 min",
    })
  }, [messages, contacts])

  const filteredContacts = contacts.filter(
    (contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || contact.phone.includes(searchQuery),
  )

  const handleAddContact = () => {
    if (!newContactPhone.trim()) {
      setError("Please enter a phone number")
      return
    }

    const formattedPhone = newContactPhone.replace(/\D/g, "")
    if (formattedPhone.length < 10) {
      setError("Please enter a valid phone number")
      return
    }

    const fullPhone = formattedPhone.startsWith("91") ? formattedPhone : `91${formattedPhone}`

    const newContact: Contact = {
      id: Date.now().toString(),
      name: `Contact +${fullPhone}`,
      phone: fullPhone,
      lastMessage: "Start a conversation...",
      timestamp: "now",
      unreadCount: 0,
    }

    setContacts((prev) => [...prev, newContact])
    setNewContactPhone("")
    setShowNewContact(false)
    setError("")
  }

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact)
    if (contact.unreadCount > 0) {
      markContactAsRead(contact.phone)
    }

    const contactMessages = getMessages(contact.phone).map((m) => ({
      id: m.id,
      text: m.text,
      timestamp: new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isFromUser: m.isFromUser,
      status: m.status,
    }))
    setMessages(contactMessages)
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedContact || isLoading) return

    setIsLoading(true)
    setError("")
    const messageText = message
    const messageId = Date.now().toString()

    try {
      const newMessage: Message = {
        id: messageId,
        text: message,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isFromUser: true,
        status: "sent",
      }

      setMessages((prev) => [...prev, newMessage])
      setMessage("")

      addMessage({
        id: messageId,
        from: phoneNumber,
        to: selectedContact.phone,
        text: messageText,
        timestamp: new Date().toISOString(),
        type: "text",
        status: "sent",
        isFromUser: true,
      })

      const result = await sendWhatsAppMessage(selectedContact.phone, messageText)
      console.log("[v0] Message sent result:", result)

      if (result.messages && result.messages[0].id) {
        setTimeout(() => {
          setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, status: "delivered" } : msg)))
        }, 1000)

        setTimeout(() => {
          setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, status: "read" } : msg)))
        }, 3000)
      } else {
        setError("Failed to send message. Please check the phone number.")
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId))
      }
    } catch (error) {
      console.error("[v0] Failed to send message:", error)
      setError("Failed to send message. Please try again.")
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId))
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3 text-muted-foreground" />
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />
      case "read":
        return <CheckCheck className="h-3 w-3 text-primary" />
      default:
        return <Clock className="h-3 w-3 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 h-[500px] sm:h-[600px]">
        <Card className="lg:col-span-1 order-2 lg:order-1">
          <CardHeader className="pb-3 px-3 sm:px-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base sm:text-lg">Conversations</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowNewContact(!showNewContact)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {showNewContact && (
              <div className="space-y-2">
                <Input
                  placeholder="Enter phone number..."
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <Button onClick={handleAddContact} size="sm" className="text-xs">
                    Add
                  </Button>
                  <Button onClick={() => setShowNewContact(false)} variant="outline" size="sm" className="text-xs">
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[350px] sm:h-[480px]">
              {filteredContacts.map((contact, index) => (
                <div key={contact.id}>
                  <div
                    className={`flex items-center gap-3 p-3 sm:p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedContact?.id === contact.id ? "bg-muted" : ""
                    }`}
                    onClick={() => handleSelectContact(contact)}
                  >
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                      <AvatarFallback>
                        <User className="h-4 w-4 sm:h-5 sm:w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate text-sm sm:text-base">{contact.name}</p>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{contact.timestamp}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                        {contact.unreadCount > 0 && (
                          <Badge
                            variant="default"
                            className="h-4 w-4 sm:h-5 sm:w-5 p-0 flex items-center justify-center text-xs flex-shrink-0"
                          >
                            {contact.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < filteredContacts.length - 1 && <Separator />}
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 order-1 lg:order-2">
          {selectedContact ? (
            <>
              <CardHeader className="pb-3 px-3 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                      <AvatarFallback>
                        <User className="h-4 w-4 sm:h-5 sm:w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm sm:text-base truncate">{selectedContact.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">+{selectedContact.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                      <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                      <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col h-[350px] sm:h-[480px] px-3 sm:px-6">
                <ScrollArea className="flex-1 pr-2 sm:pr-4">
                  <div className="space-y-3 sm:space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-6 sm:py-8">
                        <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground text-sm">No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.isFromUser ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[85%] sm:max-w-[70%] rounded-lg px-3 py-2 ${
                              msg.isFromUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <p className="text-sm break-words">{msg.text}</p>
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <span className="text-xs opacity-70">{msg.timestamp}</span>
                              {msg.isFromUser && getStatusIcon(msg.status)}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>

                <div className="flex items-center gap-2 pt-3 sm:pt-4 border-t">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 text-sm"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isLoading}
                    size="icon"
                    className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0"
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    ) : (
                      <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center px-4">
                <MessageCircle className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-semibold mb-2">Select a conversation</h3>
                <p className="text-muted-foreground text-sm">Choose a contact from the list to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
