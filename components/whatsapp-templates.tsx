"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Send,
  Copy,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
  AlertTriangle,
  Info,
  RefreshCw as Refresh,
  Settings,
} from "lucide-react"
import { sendTemplateMessage, getMessageTemplates } from "@/lib/whatsapp-api"

interface Template {
  id: string
  name: string
  category: string
  language: string
  status: "approved" | "pending" | "rejected"
  content: string
  components: Array<{
    type: string
    text?: string
    buttons?: Array<{
      type: string
      text: string
    }>
  }>
}

interface WhatsAppTemplatesProps {
  phoneNumber: string
  onStatsUpdate: (stats: any) => void
}

export function WhatsAppTemplates({ phoneNumber, onStatsUpdate }: WhatsAppTemplatesProps) {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "1",
      name: "wfh_india_otp",
      category: "Authentication",
      language: "English",
      status: "approved",
      content: "{{1}} is your verification code. For your security, do not share this code.",
      components: [
        {
          type: "BODY",
          text: "{{1}} is your verification code. For your security, do not share this code.",
        },
      ],
    },
    {
      id: "2",
      name: "customer_feedback_request",
      category: "Marketing",
      language: "English",
      status: "approved",
      content:
        "Hi {{1}}! We hope you're loving your recent purchase. Your feedback means the world to us. Could you take 30 seconds to share your experience?",
      components: [
        {
          type: "BODY",
          text: "Hi {{1}}! We hope you're loving your recent purchase. Your feedback means the world to us. Could you take 30 seconds to share your experience?",
        },
        {
          type: "BUTTONS",
          buttons: [
            { type: "URL", text: "Leave Review" },
            { type: "QUICK_REPLY", text: "Get 10% OFF Code" },
          ],
        },
      ],
    },
    {
      id: "3",
      name: "order_confirmation",
      category: "Transactional",
      language: "English",
      status: "pending",
      content:
        "Thank you for your order! Your order #{{1}} has been confirmed and will be delivered within {{2}} business days.",
      components: [
        {
          type: "BODY",
          text: "Thank you for your order! Your order #{{1}} has been confirmed and will be delivered within {{2}} business days.",
        },
      ],
    },
  ])

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [recipientPhone, setRecipientPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false)
  const [error, setError] = useState("")

  const [showCreateTemplate, setShowCreateTemplate] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    category: "UTILITY",
    language: "en",
    content: "",
    variables: [] as string[],
  })
  const [wabaId, setWabaId] = useState("")

  useEffect(() => {
    const savedWabaId = localStorage.getItem("whatsapp_waba_id")
    if (savedWabaId) setWabaId(savedWabaId)
  }, [])

  const fetchTemplates = async () => {
    setIsLoadingTemplates(true)
    setError("")
    try {
      const realTemplates = await getMessageTemplates()
      console.log("[v0] Fetched templates:", realTemplates)

      if (realTemplates && realTemplates.length > 0) {
        const formattedTemplates = realTemplates.map((template: any) => ({
          id: template.id,
          name: template.name,
          category: template.category || "Unknown",
          language: template.language || "en",
          status: template.status || "pending",
          content: template.components?.[0]?.text || "No content available",
          components: template.components || [],
        }))
        setTemplates(formattedTemplates)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch templates:", error)
      setError("Failed to fetch templates from WhatsApp API. Using local templates.")
    } finally {
      setIsLoadingTemplates(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  const handleCreateTemplate = async () => {
    if (!wabaId) {
      setError("Please configure WABA ID in settings first")
      return
    }

    setIsLoading(true)
    try {
      const templateData = {
        name: newTemplate.name,
        category: newTemplate.category,
        language: newTemplate.language,
        components: [
          {
            type: "BODY",
            text: newTemplate.content,
          },
        ],
      }

      console.log("[v0] Template to create:", templateData)

      setNewTemplate({ name: "", category: "UTILITY", language: "en", content: "", variables: [] })
      setShowCreateTemplate(false)

      setError("")
      alert("Template creation request prepared! Check console for details.")
    } catch (error) {
      console.error("[v0] Failed to create template:", error)
      setError("Failed to create template. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const detectVariables = (content: string) => {
    const matches = content.match(/\{\{(\d+)\}\}/g) || []
    return matches.map((match) => match.replace(/[{}]/g, ""))
  }

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const handleSendTemplate = async () => {
    if (!selectedTemplate || !recipientPhone || isLoading) return

    setIsLoading(true)
    setError("")
    try {
      const result = await sendTemplateMessage(recipientPhone, selectedTemplate.name)
      console.log("[v0] Template sent:", result)
      setRecipientPhone("")
      setSelectedTemplate(null)

      onStatsUpdate({ totalMessages: 1, messagesDelivered: 1 })
    } catch (error) {
      console.error("Failed to send template:", error)
      setError("Failed to send template. Please check the phone number and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyTemplateContent = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">My Templates</TabsTrigger>
          <TabsTrigger value="create">Create Template</TabsTrigger>
          <TabsTrigger value="guide">Setup Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={fetchTemplates} disabled={isLoadingTemplates}>
                <Refresh className="h-4 w-4 mr-2" />
                {isLoadingTemplates ? "Refreshing..." : "Refresh"}
              </Button>
              <Button asChild>
                <a
                  href={`https://business.facebook.com/wa/manage/message-templates/?business_id=${wabaId || "YOUR_BUSINESS_ID"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Manage in Facebook
                </a>
              </Button>
            </div>
          </div>

          {!wabaId && (
            <Alert>
              <Settings className="h-4 w-4" />
              <AlertDescription>
                Configure your WABA ID in settings to enable direct template management and better Facebook integration.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Message Templates</h3>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {filteredTemplates.map((template) => (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedTemplate?.id === template.id ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{template.name}</h4>
                            {getStatusIcon(template.status)}
                          </div>
                          <Badge className={getStatusColor(template.status)}>{template.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{template.category}</p>
                        <p className="text-sm line-clamp-2">{template.content}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-muted-foreground">{template.language}</span>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                copyTemplateContent(template.content)
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Template Preview</h3>
              {selectedTemplate ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {selectedTemplate.name}
                      {getStatusIcon(selectedTemplate.status)}
                    </CardTitle>
                    <CardDescription>
                      {selectedTemplate.category} • {selectedTemplate.language}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{selectedTemplate.content}</p>
                      {selectedTemplate.components
                        .filter((comp) => comp.type === "BUTTONS")
                        .map((comp, index) => (
                          <div key={index} className="mt-3 space-y-2">
                            {comp.buttons?.map((button, btnIndex) => (
                              <Button
                                key={btnIndex}
                                variant="outline"
                                size="sm"
                                className="w-full bg-transparent"
                                disabled
                              >
                                {button.text}
                              </Button>
                            ))}
                          </div>
                        ))}
                    </div>

                    {selectedTemplate.status === "approved" ? (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="recipient">Recipient Phone Number</Label>
                          <Input
                            id="recipient"
                            placeholder="+1234567890"
                            value={recipientPhone}
                            onChange={(e) => setRecipientPhone(e.target.value)}
                          />
                        </div>
                        <Button onClick={handleSendTemplate} disabled={!recipientPhone || isLoading} className="w-full">
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                              Sending...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Send className="h-4 w-4" />
                              Send Template
                            </div>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          This template is {selectedTemplate.status} and cannot be sent yet.
                          {selectedTemplate.status === "pending" && " Please wait for WhatsApp approval."}
                          {selectedTemplate.status === "rejected" && " Please review and resubmit the template."}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Select a Template</h3>
                      <p className="text-muted-foreground">Choose a template from the list to preview and send</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Template
              </CardTitle>
              <CardDescription>Create a new WhatsApp message template for approval</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!wabaId && (
                <Alert>
                  <Settings className="h-4 w-4" />
                  <AlertDescription>
                    Please configure your WABA ID in dashboard settings to enable template creation.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    placeholder="my_template_name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate((prev) => ({ ...prev, name: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">Use lowercase letters, numbers, and underscores only</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-category">Category</Label>
                  <Select
                    value={newTemplate.category}
                    onValueChange={(value) => setNewTemplate((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AUTHENTICATION">Authentication</SelectItem>
                      <SelectItem value="UTILITY">Utility</SelectItem>
                      <SelectItem value="MARKETING">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="template-content">Template Content</Label>
                <Textarea
                  id="template-content"
                  placeholder="Enter your template message. Use {{1}}, {{2}}, etc. for variables."
                  value={newTemplate.content}
                  onChange={(e) => {
                    const content = e.target.value
                    const variables = detectVariables(content)
                    setNewTemplate((prev) => ({ ...prev, content, variables }))
                  }}
                  rows={4}
                />
                {newTemplate.variables.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    <span className="text-xs text-muted-foreground">Variables detected:</span>
                    {newTemplate.variables.map((variable, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {newTemplate.content && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm">{newTemplate.content}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handleCreateTemplate}
                  disabled={!newTemplate.name || !newTemplate.content || !wabaId || isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Creating..." : "Create Template"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setNewTemplate({ name: "", category: "UTILITY", language: "en", content: "", variables: [] })
                  }
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guide" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Template Approval Process
              </CardTitle>
              <CardDescription>Learn how to create and get approval for WhatsApp message templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  WhatsApp requires all business-initiated messages to use pre-approved templates. Templates must be
                  approved before you can send them to customers.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Step 1: Access WhatsApp Manager</h4>
                  <p className="text-sm text-muted-foreground">
                    Go to WhatsApp Manager in your Facebook Business account to create templates.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`https://business.facebook.com/wa/manage/message-templates/?business_id=${wabaId || "YOUR_BUSINESS_ID"}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open WhatsApp Manager
                    </a>
                  </Button>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Step 2: Create Template</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside ml-4">
                    <li>Click "Create Template" in WhatsApp Manager</li>
                    <li>Choose template category (Authentication, Utility, or Marketing)</li>
                    <li>Select language and enter template name</li>
                    <li>{"Write your message content with variables like {{1}}, {{2}}, etc."}</li>
                    <li>Add buttons if needed (Call-to-Action or Quick Reply)</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Step 3: Submit for Approval</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside ml-4">
                    <li>Review your template content carefully</li>
                    <li>Submit for WhatsApp approval</li>
                    <li>Authentication templates are usually approved within minutes</li>
                    <li>Marketing templates may take 24-48 hours for review</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Template Categories</h4>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h5 className="font-medium">Authentication</h5>
                        <p className="text-sm text-muted-foreground">OTP codes, login verification, password resets</p>
                      </div>
                      <Badge variant="secondary">Fast Approval</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h5 className="font-medium">Utility</h5>
                        <p className="text-sm text-muted-foreground">
                          Order updates, appointment reminders, account notifications
                        </p>
                      </div>
                      <Badge variant="secondary">Fast Approval</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h5 className="font-medium">Marketing</h5>
                        <p className="text-sm text-muted-foreground">Promotions, newsletters, product announcements</p>
                      </div>
                      <Badge variant="outline">Review Required</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
