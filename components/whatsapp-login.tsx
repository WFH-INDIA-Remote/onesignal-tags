"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageCircle, Shield, CheckCircle } from "lucide-react"

interface WhatsAppLoginProps {
  onLogin: (credentials: { phoneNumberId: string; businessAccountId: string; accessToken: string }) => void
}

export function WhatsAppLogin({ onLogin }: WhatsAppLoginProps) {
  const [credentials, setCredentials] = useState({
    phoneNumberId: "766481149883714",
    businessAccountId: "1052392060420311",
    accessToken:
      "EAAcZA6cZBTkW0BPe4FZAZCP9feIjU6q7f7wkfSvQcpbyb6udBmRdyuPF2rIKNJfNoosKdh6bZBrCzE7k1i5biD4FdKRYH1Sft6vfaqnNpdeo9AtlWIArZBFx8Mta9ww4HpjCwBWnKnZAmuMCGaY91alYa9dwgkczvJE3D8v1lOBoeFV2wPQlSc7gi5xZBp7O7AZDZD",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)
    // Simulate API validation
    setTimeout(() => {
      onLogin(credentials)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-balance">WhatsApp Business Manager</CardTitle>
          <CardDescription className="text-pretty">
            Connect your WhatsApp Business account to manage messages and templates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phoneNumberId">Phone Number ID</Label>
            <Input
              id="phoneNumberId"
              value={credentials.phoneNumberId}
              onChange={(e) => setCredentials((prev) => ({ ...prev, phoneNumberId: e.target.value }))}
              placeholder="Enter your Phone Number ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessAccountId">WhatsApp Business Account ID</Label>
            <Input
              id="businessAccountId"
              value={credentials.businessAccountId}
              onChange={(e) => setCredentials((prev) => ({ ...prev, businessAccountId: e.target.value }))}
              placeholder="Enter your Business Account ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accessToken">Access Token</Label>
            <Input
              id="accessToken"
              type="password"
              value={credentials.accessToken}
              onChange={(e) => setCredentials((prev) => ({ ...prev, accessToken: e.target.value }))}
              placeholder="Enter your Access Token"
            />
          </div>

          <div className="bg-card p-4 rounded-lg border">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Secure Connection</p>
                <p className="text-xs text-muted-foreground">
                  Your credentials are stored securely and used only for API communication
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleLogin}
            className="w-full"
            disabled={
              isLoading || !credentials.phoneNumberId || !credentials.businessAccountId || !credentials.accessToken
            }
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Connecting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Connect to WhatsApp Business
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
