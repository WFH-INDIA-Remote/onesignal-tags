"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, ExternalLink, Copy, AlertTriangle, Info, Settings, Webhook, FileText } from "lucide-react"

export function WhatsAppSetupGuide() {
  const [copiedText, setCopiedText] = useState("")

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(label)
    setTimeout(() => setCopiedText(""), 2000)
  }

  const webhookUrl = `${typeof window !== "undefined" ? window.location.origin : "https://your-domain.com"}/api/webhook`
  const verifyToken = "whatsapp_business_verify_token_2024"

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">WhatsApp Business API Setup Guide</h2>
        <p className="text-muted-foreground">Complete setup guide for WhatsApp Business API integration</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="facebook-setup">Facebook Setup</TabsTrigger>
          <TabsTrigger value="webhook">Webhook Config</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Setup Overview
              </CardTitle>
              <CardDescription>Follow these steps to set up WhatsApp Business API for your application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Facebook Developer Account</h4>
                    <p className="text-sm text-muted-foreground">
                      Create and configure your Facebook Developer account
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">WhatsApp Business App</h4>
                    <p className="text-sm text-muted-foreground">
                      Create a WhatsApp Business app in Facebook Developer Console
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Webhook Configuration</h4>
                    <p className="text-sm text-muted-foreground">Set up webhook to receive incoming messages</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium">Message Templates</h4>
                    <p className="text-sm text-muted-foreground">Create and get approval for message templates</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    5
                  </div>
                  <div>
                    <h4 className="font-medium">Testing & Go Live</h4>
                    <p className="text-sm text-muted-foreground">
                      Test your integration and submit for production approval
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facebook-setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Facebook Developer Console Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                      1
                    </span>
                    Create Facebook Developer Account
                  </h4>
                  <p className="text-sm text-muted-foreground ml-7">
                    Go to Facebook Developers and create an account if you don't have one.
                  </p>
                  <Button variant="outline" size="sm" className="ml-7 bg-transparent" asChild>
                    <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Facebook Developers
                    </a>
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                      2
                    </span>
                    Create New App
                  </h4>
                  <div className="ml-7 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Click "Create App" and select "Business" as the app type.
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Enter your app name and contact email</li>
                      <li>Select your business account</li>
                      <li>Complete the app creation process</li>
                    </ul>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                      3
                    </span>
                    Add WhatsApp Product
                  </h4>
                  <div className="ml-7 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      In your app dashboard, find "WhatsApp" and click "Set up".
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Choose "Cloud API" (recommended)</li>
                      <li>Set up your business account</li>
                      <li>Add a phone number for testing</li>
                    </ul>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                      4
                    </span>
                    Get API Credentials
                  </h4>
                  <div className="ml-7 space-y-3">
                    <p className="text-sm text-muted-foreground">Copy these values from your WhatsApp API setup:</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm font-medium">Phone Number ID</span>
                        <Badge variant="secondary">Required</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm font-medium">Business Account ID</span>
                        <Badge variant="secondary">Required</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm font-medium">Access Token</span>
                        <Badge variant="secondary">Required</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhook" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhook Configuration
              </CardTitle>
              <CardDescription>
                Configure webhook to receive incoming messages and delivery status updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Copy these URLs and paste them directly in Facebook Developer Console. No need to search Google!
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Webhook URL</h4>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-3 bg-muted rounded text-sm font-mono">{webhookUrl}</code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(webhookUrl, "webhook-url")}
                      className="min-w-[80px]"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      {copiedText === "webhook-url" ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    📋 Copy this URL and paste it in Facebook Developer Console → WhatsApp → Configuration → Webhook
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Verify Token</h4>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-3 bg-muted rounded text-sm font-mono">{verifyToken}</code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(verifyToken, "verify-token")}
                      className="min-w-[80px]"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      {copiedText === "verify-token" ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    📋 Copy this token and paste it in the Verify Token field
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium text-green-600">Quick Setup (No Google Search Needed!)</h4>
                  <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white text-sm font-medium">
                        1
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Open Facebook Developer Console</p>
                        <Button variant="outline" size="sm" className="mt-2 bg-transparent" asChild>
                          <a href="https://developers.facebook.com/apps" target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open Facebook Developers
                          </a>
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white text-sm font-medium">
                        2
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Go to: Your App → WhatsApp → Configuration → Webhook</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Click "Edit" button next to Webhook section
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white text-sm font-medium">
                        3
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Paste the URLs above and click "Verify and Save"</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Make sure to subscribe to: messages, message_deliveries, message_reads
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Message Templates Setup
              </CardTitle>
              <CardDescription>Create and get approval for WhatsApp message templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  WhatsApp requires pre-approved templates for business-initiated conversations. Templates must be
                  approved before you can send them.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Template Categories</h4>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h5 className="font-medium">Authentication</h5>
                        <p className="text-sm text-muted-foreground">OTP codes, login verification</p>
                      </div>
                      <Badge variant="secondary">Fast Approval</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h5 className="font-medium">Utility</h5>
                        <p className="text-sm text-muted-foreground">Order updates, account notifications</p>
                      </div>
                      <Badge variant="secondary">Fast Approval</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h5 className="font-medium">Marketing</h5>
                        <p className="text-sm text-muted-foreground">Promotions, newsletters</p>
                      </div>
                      <Badge variant="outline">Review Required</Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium">Creating Templates</h4>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>Go to WhatsApp Manager → Message Templates</li>
                    <li>Click "Create Template"</li>
                    <li>Choose template category and language</li>
                    <li>
                      Write your template content with variables like {"{{"}
                      {1}
                      {"}}"}, {"{{"}
                      {2}
                      {"}}"}, etc.
                    </li>
                    <li>Add buttons if needed (Call-to-Action, Quick Reply)</li>
                    <li>Submit for approval</li>
                  </ol>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium">Template Best Practices</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                    <li>Keep messages clear and concise</li>
                    <li>Use variables for personalization</li>
                    <li>Follow WhatsApp's content policies</li>
                    <li>Test templates thoroughly before submission</li>
                    <li>Authentication templates are approved fastest</li>
                  </ul>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Current Status:</strong> You have 1 approved template (wfh_india_otp) ready to use for OTP
                    verification.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="troubleshooting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Common Issues & Solutions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="font-medium text-red-600">Messages not being received</h4>
                    <div className="ml-4 space-y-1 text-sm text-muted-foreground">
                      <p>
                        <strong>Possible causes:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Webhook URL not accessible or incorrect</li>
                        <li>Webhook not subscribed to 'messages' field</li>
                        <li>Verify token mismatch</li>
                        <li>HTTPS certificate issues</li>
                      </ul>
                      <p className="mt-2">
                        <strong>Solutions:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Check webhook URL is publicly accessible</li>
                        <li>Verify webhook subscription in Facebook Developer Console</li>
                        <li>Ensure verify token matches exactly</li>
                        <li>Test webhook endpoint manually</li>
                      </ul>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium text-red-600">Template messages failing</h4>
                    <div className="ml-4 space-y-1 text-sm text-muted-foreground">
                      <p>
                        <strong>Possible causes:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Template not approved</li>
                        <li>Incorrect template name or parameters</li>
                        <li>24-hour messaging window expired</li>
                        <li>Invalid phone number format</li>
                      </ul>
                      <p className="mt-2">
                        <strong>Solutions:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Check template approval status</li>
                        <li>Verify template name and parameter count</li>
                        <li>Use approved templates for business-initiated messages</li>
                        <li>Format phone numbers correctly (country code + number)</li>
                      </ul>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium text-red-600">API authentication errors</h4>
                    <div className="ml-4 space-y-1 text-sm text-muted-foreground">
                      <p>
                        <strong>Possible causes:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Invalid or expired access token</li>
                        <li>Incorrect phone number ID</li>
                        <li>Missing required permissions</li>
                      </ul>
                      <p className="mt-2">
                        <strong>Solutions:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Generate new access token from Facebook Developer Console</li>
                        <li>Verify phone number ID in WhatsApp API setup</li>
                        <li>Check app permissions and business verification status</li>
                      </ul>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium text-orange-600">Rate limiting</h4>
                    <div className="ml-4 space-y-1 text-sm text-muted-foreground">
                      <p>
                        <strong>Current limits:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>1,000 messages per day (new business accounts)</li>
                        <li>80 messages per second</li>
                        <li>Limits increase with business verification</li>
                      </ul>
                      <p className="mt-2">
                        <strong>Solutions:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Complete business verification to increase limits</li>
                        <li>Implement message queuing for high volume</li>
                        <li>Monitor rate limit headers in API responses</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
