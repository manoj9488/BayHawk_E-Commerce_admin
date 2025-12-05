"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function LegalPage() {
  const [privacyPolicy, setPrivacyPolicy] = useState(
    "Your privacy is important to us. It is our policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate."
  )
  const [terms, setTerms] = useState(
    "By accessing the website at, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws."
  )

  const handleSave = () => {
    // In a real app, you'd save this to a database
    console.log("Saving legal content:", { privacyPolicy, terms })
    toast.success("Legal pages updated successfully!")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Legal Pages</h1>
      <Card>
        <CardHeader>
          <CardTitle>Privacy Policy</CardTitle>
          <CardDescription>Manage the content of your privacy policy page.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={privacyPolicy}
            onChange={(e) => setPrivacyPolicy(e.target.value)}
            rows={10}
            className="mb-4"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Terms of Service</CardTitle>
          <CardDescription>Manage the content of your terms of service page.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea value={terms} onChange={(e) => setTerms(e.target.value)} rows={10} className="mb-4" />
        </CardContent>
      </Card>
      <Button onClick={handleSave}>Save Changes</Button>
    </div>
  )
}
