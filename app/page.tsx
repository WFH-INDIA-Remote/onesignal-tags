"use client"

import { useState } from "react"
import { WhatsAppDashboard } from "@/components/whatsapp-dashboard"
import { PhoneVerification } from "@/components/phone-verification"

interface Credentials {
  phoneNumberId: string
  businessAccountId: string
  accessToken: string
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)

  const handlePhoneVerified = (phone: string) => {
    setPhoneNumber(phone)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setPhoneNumber(null)
  }

  if (!isAuthenticated) {
    return <PhoneVerification onVerified={handlePhoneVerified} />
  }

  return <WhatsAppDashboard phoneNumber={phoneNumber!} onLogout={handleLogout} />
}
