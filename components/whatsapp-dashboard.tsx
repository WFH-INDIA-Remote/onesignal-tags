"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  MessageCircle,
  Send,
  BookTemplate as Template,
  BarChart3,
  LogOut,
  Users,
  Clock,
  CheckCircle2,
  Settings,
  Copy,
  Check,
  Code,
} from "lucide-react"
import { WhatsAppMessenger } from "./whatsapp-messenger"
import { WhatsAppTemplates } from "./whatsapp-templates"
import { DeveloperSetupGuide } from "./developer-setup-guide" // Added import for developer setup guide
import { getPhoneNumberInfo } from "@/lib/whatsapp-api"

interface WhatsAppDashboardProps {
  phoneNumber: string
  onLogout: () => void
}

interface ApiSettings {
  phoneNumberId: string
  businessAccountId: string
  accessToken: string
}

export function WhatsAppDashboard({ phoneNumber, onLogout }: WhatsAppDashboardProps) {
  const [stats, setStats] = useState({
    totalMessages: 0,
    messagesDelivered: 0,
    messagesRead: 0,
    activeChats: 0,
    responseTime: "0 min",
  })
  const [phoneInfo, setPhoneInfo] = useState<any>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [wabaId, setWabaId] = useState("")
  const [apiSettings, setApiSettings] = useState<ApiSettings>({
    phoneNumberId: "",
    businessAccountId: "",
    accessToken: "",
  })
  const [webhookCopied, setWebhookCopied] = useState(false)

  const webhookUrl =
    typeof window !== "undefined" ? `${window.location.origin}/api/webhook` : "https://your-domain.com/api/webhook"

  useEffect(() => {
    const fetchPhoneInfo = async () => {
      try {
        const info = await getPhoneNumberInfo()
        setPhoneInfo(info)
        console.log("[v0] Phone info:", info)
      } catch (error) {
        console.error("[v0] Failed to fetch phone info:", error)
      }
    }

    fetchPhoneInfo()
  }, [])

  useEffect(() => {
    const savedWabaId = localStorage.getItem("whatsapp_waba_id")
    const savedSettings = localStorage.getItem("whatsapp_api_settings")

    if (savedWabaId) setWabaId(savedWabaId)
    if (savedSettings) {
      try {
        setApiSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error("[v0] Failed to parse saved settings:", error)
      }
    }
  }, [])

  const updateStats = (newStats: Partial<typeof stats>) => {
    setStats((prev) => ({ ...prev, ...newStats }))
  }

  const handleSaveSettings = () => {
    localStorage.setItem("whatsapp_waba_id", wabaId)
    localStorage.setItem("whatsapp_api_settings", JSON.stringify(apiSettings))
    setShowSettings(false)
  }

  const copyWebhookUrl = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl)
      setWebhookCopied(true)
      setTimeout(() => setWebhookCopied(false), 2000)
    } catch (error) {
      console.error("[v0] Failed to copy webhook URL:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
              <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-bold truncate">WhatsApp Business Manager</h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                Verified: +{phoneNumber} | {phoneInfo?.display_phone_number || "Loading..."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)}>
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                  <Send className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold">{stats.totalMessages}</p>
                  <p className="text-xs text-muted-foreground truncate">Total Messages</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-accent/10 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                  <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold">{stats.messagesDelivered}</p>
                  <p className="text-xs text-muted-foreground truncate">Delivered</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-chart-1/10 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                  <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-chart-1" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold">{stats.messagesRead}</p>
                  <p className="text-xs text-muted-foreground truncate">Read</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-chart-2/10 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 text-chart-2" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold">{stats.activeChats}</p>
                  <p className="text-xs text-muted-foreground truncate">Active Chats</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-2 sm:col-span-1">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-chart-4/10 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-chart-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold">{stats.responseTime}</p>
                  <p className="text-xs text-muted-foreground truncate">Avg Response</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="messages" className="space-y-4">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-4 min-w-[400px]">
              <TabsTrigger value="messages" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Messages</span>
                <span className="sm:hidden">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Template className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Templates</span>
                <span className="sm:hidden">Templates</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Analytics</span>
                <span className="sm:hidden">Stats</span>
              </TabsTrigger>
              <TabsTrigger value="setup" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Code className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Setup Guide</span>
                <span className="sm:hidden">Setup</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="messages">
            <WhatsAppMessenger phoneNumber={phoneNumber} onStatsUpdate={updateStats} />
          </TabsContent>

          <TabsContent value="templates">
            <WhatsAppTemplates phoneNumber={phoneNumber} onStatsUpdate={updateStats} />
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  View detailed analytics and insights for your WhatsApp Business account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="setup">
            <DeveloperSetupGuide />
          </TabsContent>
        </Tabs>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                WhatsApp API Settings
              </CardTitle>
              <CardDescription>Configure your WhatsApp Business API credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Webhook URL</label>
                <div className="flex gap-2 mt-1">
                  <Input value={webhookUrl} readOnly className="flex-1" />
                  <Button variant="outline" size="sm" onClick={copyWebhookUrl}>
                    {webhookCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Copy this URL and paste it in Facebook Developer Console webhook settings
                </p>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium">WhatsApp Business Account ID (WABA ID)</label>
                <Input value={wabaId} onChange={(e) => setWabaId(e.target.value)} placeholder="1052392060420311" />
                <p className="text-xs text-muted-foreground mt-1">
                  Used for template management and business verification
                </p>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium">Phone Number ID</label>
                <Input
                  value={apiSettings.phoneNumberId}
                  onChange={(e) => setApiSettings((prev) => ({ ...prev, phoneNumberId: e.target.value }))}
                  placeholder="766481149883714"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Business Account ID</label>
                <Input
                  value={apiSettings.businessAccountId}
                  onChange={(e) => setApiSettings((prev) => ({ ...prev, businessAccountId: e.target.value }))}
                  placeholder="1052392060420311"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Access Token</label>
                <Input
                  type="password"
                  value={apiSettings.accessToken}
                  onChange={(e) => setApiSettings((prev) => ({ ...prev, accessToken: e.target.value }))}
                  placeholder="EAAcZA6cZBTkW0BP..."
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  💡 <strong>Pro Tip:</strong> With WABA ID configured, you can manage templates directly from this
                  website without going to Facebook Developer Console!
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveSettings} className="flex-1">
                  Save Settings
                </Button>
                <Button variant="outline" onClick={() => setShowSettings(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
