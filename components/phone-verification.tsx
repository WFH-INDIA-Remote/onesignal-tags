"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, MessageCircle, Shield } from "lucide-react"
import { sendOTPMessage } from "@/lib/whatsapp-api"

interface PhoneVerificationProps {
  onVerified: (phoneNumber: string) => void
}

export function PhoneVerification({ onVerified }: PhoneVerificationProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [enteredOtp, setEnteredOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [otpSent, setOtpSent] = useState(false)

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  const handleSendOTP = async () => {
    if (!phoneNumber.trim()) {
      setError("Please enter your phone number")
      return
    }

    // Format phone number (remove spaces, dashes, etc.)
    const formattedPhone = phoneNumber.replace(/\D/g, "")

    if (formattedPhone.length < 10) {
      setError("Please enter a valid phone number")
      return
    }

    setLoading(true)
    setError("")

    try {
      const generatedOtp = generateOTP()
      setOtp(generatedOtp)

      // Add country code if not present
      const fullPhoneNumber = formattedPhone.startsWith("91") ? formattedPhone : `91${formattedPhone}`

      console.log("[v0] Sending OTP to:", fullPhoneNumber)
      console.log("[v0] Generated OTP:", generatedOtp)

      const result = await sendOTPMessage(fullPhoneNumber, generatedOtp)

      console.log("[v0] WhatsApp API Response:", result)

      if (result.error) {
        console.error("[v0] WhatsApp API Error:", result.error)
        setError(`Failed to send OTP: ${result.error.message || "Unknown error"}`)
        return
      }

      if (result.messages && result.messages[0].id) {
        console.log("[v0] OTP sent successfully, Message ID:", result.messages[0].id)
        setOtpSent(true)
        setStep("otp")
      } else {
        console.error("[v0] Unexpected API response:", result)
        setError("Failed to send OTP. Please check your phone number and try again.")
      }
    } catch (err: any) {
      console.error("[v0] OTP send error:", err)
      setError(`Failed to send OTP: ${err.message || "Network error"}`)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = () => {
    if (!enteredOtp.trim()) {
      setError("Please enter the OTP")
      return
    }

    if (enteredOtp === otp) {
      const formattedPhone = phoneNumber.replace(/\D/g, "")
      const fullPhoneNumber = formattedPhone.startsWith("91") ? formattedPhone : `91${formattedPhone}`
      onVerified(fullPhoneNumber)
    } else {
      setError("Invalid OTP. Please try again.")
    }
  }

  const handleResendOTP = () => {
    setEnteredOtp("")
    setError("")
    handleSendOTP()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">WhatsApp Business Verification</CardTitle>
          <CardDescription>
            {step === "phone"
              ? "Enter your phone number to receive verification code"
              : "Enter the 6-digit code sent to your WhatsApp"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === "phone" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="text-lg"
                />
                <p className="text-sm text-gray-600">We'll send a verification code to this number via WhatsApp</p>
              </div>
              <Button onClick={handleSendOTP} disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  "Send Verification Code"
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  className="text-lg text-center tracking-widest"
                  maxLength={6}
                />
                <p className="text-sm text-gray-600">Code sent to +{phoneNumber}</p>
              </div>
              <div className="space-y-2">
                <Button onClick={handleVerifyOTP} className="w-full bg-green-600 hover:bg-green-700">
                  <Shield className="mr-2 h-4 w-4" />
                  Verify Code
                </Button>
                <Button
                  onClick={handleResendOTP}
                  variant="outline"
                  className="w-full bg-transparent"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    "Resend Code"
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
