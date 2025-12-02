"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Check, ExternalLink, Code, Settings, Zap, FileText } from "lucide-react"

export function DeveloperSetupGuide() {
  const [copiedSteps, setCopiedSteps] = useState<{ [key: string]: boolean }>({})

  const copyToClipboard = (text: string, stepId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSteps((prev) => ({ ...prev, [stepId]: true }))
    setTimeout(() => {
      setCopiedSteps((prev) => ({ ...prev, [stepId]: false }))
    }, 2000)
  }

  const projectStructure = `whatsapp-business-manager/
├── app/
│   ├── api/
│   │   └── webhook/
│   │       └── route.ts          # WhatsApp webhook handler
│   ├── globals.css               # Tailwind styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main app entry
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── whatsapp-dashboard.tsx   # Main dashboard
│   ├── whatsapp-messenger.tsx   # Message interface
│   ├── whatsapp-templates.tsx   # Template management
│   ├── phone-verification.tsx   # Phone verification
│   └── developer-setup-guide.tsx # This guide
├── lib/
│   ├── whatsapp-api.ts         # WhatsApp API functions
│   ├── message-store.ts        # Message storage
│   └── utils.ts                # Utility functions
├── package.json
├── next.config.mjs
└── tsconfig.json`

  const envVariables = `# WhatsApp Business API Configuration
WHATSAPP_ACCESS_TOKEN=your_access_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_custom_verify_token

# Next.js Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com`

  const webhookCode = `// app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { addMessage } from '@/lib/message-store'

const VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified successfully!')
    return new NextResponse(challenge)
  }
  
  return new NextResponse('Forbidden', { status: 403 })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (body.entry?.[0]?.changes?.[0]?.value?.messages) {
      const messages = body.entry[0].changes[0].value.messages
      
      for (const message of messages) {
        await addMessage({
          id: message.id,
          from: message.from,
          text: message.text?.body || '',
          timestamp: new Date(parseInt(message.timestamp) * 1000),
          type: 'received'
        })
      }
    }
    
    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}`

  const packageJsonContent = `{
  "name": "whatsapp-business-manager",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "15.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "lucide-react": "^0.263.1",
    "tailwindcss": "^3.4.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^1.14.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "15.0.0"
  }
}`

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">WhatsApp Business API Setup Guide</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Complete step-by-step guide to clone and setup your own WhatsApp Business Manager. Perfect for beginners - no
          coding experience required!
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="secondary">
            <Code className="w-4 h-4 mr-1" />
            Next.js
          </Badge>
          <Badge variant="secondary">
            <Settings className="w-4 h-4 mr-1" />
            WhatsApp API
          </Badge>
          <Badge variant="secondary">
            <Zap className="w-4 h-4 mr-1" />
            Real-time
          </Badge>
          <Badge variant="secondary">
            <FileText className="w-4 h-4 mr-1" />
            Templates
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="facebook">Facebook Setup</TabsTrigger>
          <TabsTrigger value="project">Project Setup</TabsTrigger>
          <TabsTrigger value="webhook">Webhook Config</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Project Structure
              </CardTitle>
              <CardDescription>Understanding the file organization and components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{projectStructure}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 bg-transparent"
                  onClick={() => copyToClipboard(projectStructure, "structure")}
                >
                  {copiedSteps.structure ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">✅ Message Management</h4>
                  <p className="text-sm text-muted-foreground">Real-time message receiving and sending</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">✅ Template System</h4>
                  <p className="text-sm text-muted-foreground">Create and manage WhatsApp templates</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">✅ Webhook Integration</h4>
                  <p className="text-sm text-muted-foreground">Automatic message synchronization</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">✅ Business Verification</h4>
                  <p className="text-sm text-muted-foreground">Phone number verification system</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facebook" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5" />
                Facebook Developer Console Setup
              </CardTitle>
              <CardDescription>Step-by-step Facebook Business API configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Step 1: Create Facebook Developer Account</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Go to{" "}
                    <a
                      href="https://developers.facebook.com"
                      target="_blank"
                      className="text-primary hover:underline"
                      rel="noreferrer"
                    >
                      developers.facebook.com
                    </a>{" "}
                    and create an account
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Step 2: Create New App</h4>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    <li>• Click "Create App"</li>
                    <li>• Select "Business" as app type</li>
                    <li>• Enter app name (e.g., "My WhatsApp Business")</li>
                    <li>• Add your email and select Business Manager account</li>
                  </ul>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Step 3: Add WhatsApp Product</h4>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    <li>• In your app dashboard, click "Add Product"</li>
                    <li>• Find "WhatsApp" and click "Set up"</li>
                    <li>• Select or create a Business Manager account</li>
                    <li>• Create or select a WhatsApp Business Account</li>
                  </ul>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Step 4: Get Your Credentials</h4>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    <li>
                      • <strong>Access Token:</strong> From WhatsApp → Getting Started
                    </li>
                    <li>
                      • <strong>Phone Number ID:</strong> From WhatsApp → Getting Started
                    </li>
                    <li>
                      • <strong>Business Account ID:</strong> From WhatsApp → Getting Started
                    </li>
                    <li>
                      • <strong>App ID & App Secret:</strong> From Settings → Basic
                    </li>
                  </ul>
                </div>

                <Alert>
                  <AlertDescription>
                    <strong>Important:</strong> Keep your Access Token secure! Never share it publicly or commit it to
                    version control.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="project" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Setup & Installation</CardTitle>
              <CardDescription>Clone the project and configure your environment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Step 1: Clone or Download Project</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Download the project files and extract to your desired folder
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Step 2: Install Dependencies</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">Open terminal in project folder and run:</p>
                  <div className="relative">
                    <pre className="bg-muted p-3 rounded text-sm">npm install</pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-1 right-1 bg-transparent"
                      onClick={() => copyToClipboard("npm install", "npm-install")}
                    >
                      {copiedSteps["npm-install"] ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Step 3: Create Environment File</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Create <code>.env.local</code> file in project root:
                  </p>
                  <div className="relative">
                    <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                      <code>{envVariables}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-1 right-1 bg-transparent"
                      onClick={() => copyToClipboard(envVariables, "env")}
                    >
                      {copiedSteps.env ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Step 4: Update package.json</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Make sure your package.json includes all required dependencies:
                  </p>
                  <div className="relative">
                    <pre className="bg-muted p-3 rounded text-sm overflow-x-auto max-h-64">
                      <code>{packageJsonContent}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-1 right-1 bg-transparent"
                      onClick={() => copyToClipboard(packageJsonContent, "package")}
                    >
                      {copiedSteps.package ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhook" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <CardDescription>Setup webhook to receive WhatsApp messages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Step 1: Create Webhook Route</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Create <code>app/api/webhook/route.ts</code> file:
                  </p>
                  <div className="relative">
                    <pre className="bg-muted p-3 rounded text-sm overflow-x-auto max-h-96">
                      <code>{webhookCode}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-1 right-1 bg-transparent"
                      onClick={() => copyToClipboard(webhookCode, "webhook")}
                    >
                      {copiedSteps.webhook ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Step 2: Test Locally</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">Start development server:</p>
                  <div className="relative">
                    <pre className="bg-muted p-3 rounded text-sm">npm run dev</pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-1 right-1 bg-transparent"
                      onClick={() => copyToClipboard("npm run dev", "dev")}
                    >
                      {copiedSteps.dev ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your app will be available at <code>http://localhost:3000</code>
                  </p>
                </div>

                <Alert>
                  <AlertDescription>
                    <strong>Note:</strong> For webhook testing, you'll need to deploy your app or use a tool like ngrok
                    to expose your local server to the internet.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Guide</CardTitle>
              <CardDescription>Deploy your WhatsApp Business Manager to production</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Option 1: Deploy to Vercel (Recommended)</h4>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    <li>• Push your code to GitHub repository</li>
                    <li>
                      • Go to{" "}
                      <a
                        href="https://vercel.com"
                        target="_blank"
                        className="text-primary hover:underline"
                        rel="noreferrer"
                      >
                        vercel.com
                      </a>{" "}
                      and sign up
                    </li>
                    <li>• Click "New Project" and import your GitHub repo</li>
                    <li>• Add environment variables in Vercel dashboard</li>
                    <li>• Deploy and get your production URL</li>
                  </ul>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Option 2: Deploy to Netlify</h4>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    <li>
                      • Build your project: <code>npm run build</code>
                    </li>
                    <li>
                      • Go to{" "}
                      <a
                        href="https://netlify.com"
                        target="_blank"
                        className="text-primary hover:underline"
                        rel="noreferrer"
                      >
                        netlify.com
                      </a>{" "}
                      and sign up
                    </li>
                    <li>
                      • Drag and drop your <code>out</code> folder
                    </li>
                    <li>• Configure environment variables</li>
                  </ul>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Step 3: Configure Webhook in Facebook</h4>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    <li>• Go to your Facebook App → WhatsApp → Configuration</li>
                    <li>
                      • Add webhook URL: <code>https://your-domain.com/api/webhook</code>
                    </li>
                    <li>• Add your verify token from environment variables</li>
                    <li>• Subscribe to webhook fields: messages, message_deliveries</li>
                  </ul>
                </div>

                <Alert>
                  <AlertDescription>
                    <strong>Important:</strong> Make sure your webhook URL is publicly accessible and uses HTTPS for
                    production.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Testing Your Setup</CardTitle>
              <CardDescription>Verify everything is working correctly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-green-700">✅ Webhook Verification</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Facebook will send a GET request to verify your webhook. Check your server logs for "Webhook
                    verified successfully!"
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-green-700">✅ Send Test Message</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Use WhatsApp Business API test number to send a message to your webhook endpoint
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-green-700">✅ Template Testing</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create and send a template message through your dashboard
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-green-700">✅ Real Message Flow</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Send a message from a real WhatsApp number to your business number and verify it appears in your
                    dashboard
                  </p>
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  <strong>Troubleshooting:</strong> If messages aren't appearing, check your webhook logs, verify your
                  access token, and ensure your webhook URL is correctly configured in Facebook Developer Console.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold text-primary">Ready to Get Started?</h3>
            <p className="text-muted-foreground">
              Follow this guide step by step, and you'll have your own WhatsApp Business Manager running in no time!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild>
                <a href="https://developers.facebook.com" target="_blank" rel="noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Facebook Developers
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://vercel.com" target="_blank" rel="noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Deploy on Vercel
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
