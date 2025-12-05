"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Rocket,
  Plus,
  Smartphone,
  Globe,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  Eye,
  History,
  ToggleLeft,
} from "lucide-react"
import { toast } from "sonner"

interface Release {
  id: string
  version: string
  platform: "android" | "ios" | "web"
  releaseDate: Date
  status: "live" | "staged" | "draft" | "rollback"
  changelog: string[]
  forceUpdate: boolean
  minSupportedVersion: string
  downloadCount?: number
}

const mockReleases: Release[] = [
  {
    id: "1",
    version: "2.5.0",
    platform: "android",
    releaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    status: "live",
    changelog: ["New spinner wheel rewards", "Improved checkout flow", "Bug fixes and performance improvements"],
    forceUpdate: false,
    minSupportedVersion: "2.0.0",
    downloadCount: 1250,
  },
  {
    id: "2",
    version: "2.5.0",
    platform: "ios",
    releaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    status: "live",
    changelog: ["New spinner wheel rewards", "Improved checkout flow", "Bug fixes and performance improvements"],
    forceUpdate: false,
    minSupportedVersion: "2.0.0",
    downloadCount: 890,
  },
  {
    id: "3",
    version: "2.5.1",
    platform: "android",
    releaseDate: new Date(),
    status: "staged",
    changelog: ["Fixed payment gateway issue", "Improved notification delivery"],
    forceUpdate: false,
    minSupportedVersion: "2.0.0",
  },
  {
    id: "4",
    version: "3.0.0",
    platform: "web",
    releaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    status: "live",
    changelog: ["Complete UI redesign", "Dark mode support", "Multi-language support"],
    forceUpdate: true,
    minSupportedVersion: "2.5.0",
  },
]

interface FeatureToggle {
  id: string
  name: string
  description: string
  enabled: boolean
  platforms: string[]
  rolloutPercentage: number
}

const mockFeatureToggles: FeatureToggle[] = [
  {
    id: "1",
    name: "spinner_wheel",
    description: "Spin to win feature",
    enabled: true,
    platforms: ["android", "ios", "web"],
    rolloutPercentage: 100,
  },
  {
    id: "2",
    name: "scratch_cards",
    description: "Scratch card rewards",
    enabled: true,
    platforms: ["android", "ios"],
    rolloutPercentage: 100,
  },
  {
    id: "3",
    name: "dark_mode",
    description: "Dark mode theme",
    enabled: true,
    platforms: ["web"],
    rolloutPercentage: 100,
  },
  {
    id: "4",
    name: "ai_recommendations",
    description: "AI-powered product recommendations",
    enabled: false,
    platforms: ["android", "ios", "web"],
    rolloutPercentage: 0,
  },
  {
    id: "5",
    name: "voice_search",
    description: "Voice search functionality",
    enabled: true,
    platforms: ["android", "ios"],
    rolloutPercentage: 50,
  },
  {
    id: "6",
    name: "live_tracking",
    description: "Real-time delivery tracking",
    enabled: true,
    platforms: ["android", "ios", "web"],
    rolloutPercentage: 100,
  },
]

export default function ReleasesPage() {
  const [releases, setReleases] = useState(mockReleases)
  const [featureToggles, setFeatureToggles] = useState(mockFeatureToggles)
  const [createOpen, setCreateOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewRelease, setPreviewRelease] = useState<Release | null>(null)
  const [newRelease, setNewRelease] = useState({
    version: "",
    platform: "",
    changelog: "",
    minVersion: "",
    status: "draft",
    forceUpdate: false,
  })

  const handleCreateRelease = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRelease.version || !newRelease.platform || !newRelease.changelog) {
      toast.error("Please fill all required fields")
      return
    }

    const release: Release = {
      id: Date.now().toString(),
      version: newRelease.version,
      platform: newRelease.platform as "android" | "ios" | "web",
      releaseDate: new Date(),
      status: newRelease.status as "live" | "staged" | "draft",
      changelog: newRelease.changelog.split("\n").filter(line => line.trim()),
      forceUpdate: newRelease.forceUpdate,
      minSupportedVersion: newRelease.minVersion || "1.0.0",
      downloadCount: 0,
    }

    setReleases([release, ...releases])
    setNewRelease({
      version: "",
      platform: "",
      changelog: "",
      minVersion: "",
      status: "draft",
      forceUpdate: false,
    })
    setCreateOpen(false)
    toast.success("Release created successfully!")
  }

  const handleDeploy = (releaseId: string) => {
    setReleases(prev => prev.map(r => 
      r.id === releaseId ? { ...r, status: "live" as const } : r
    ))
    toast.success("Release deployed successfully!")
  }

  const handlePreview = (release: Release) => {
    setPreviewRelease(release)
    setPreviewOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return <Badge className="bg-success/20 text-success border-success/30">Live</Badge>
      case "staged":
        return <Badge className="bg-warning/20 text-warning border-warning/30">Staged</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "rollback":
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Rolled Back</Badge>
      default:
        return null
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "android":
      case "ios":
        return <Smartphone className="h-4 w-4" />
      case "web":
        return <Globe className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Release Management</h1>
          <p className="text-muted-foreground">Manage app releases and feature toggles</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Release
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Release</DialogTitle>
              <DialogDescription>Deploy a new version to users</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateRelease}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="version">Version</Label>
                    <Input 
                      id="version" 
                      placeholder="e.g., 2.6.0" 
                      value={newRelease.version}
                      onChange={(e) => setNewRelease({ ...newRelease, version: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select value={newRelease.platform} onValueChange={(v) => setNewRelease({ ...newRelease, platform: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="android">Android</SelectItem>
                        <SelectItem value="ios">iOS</SelectItem>
                        <SelectItem value="web">Web</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="changelog">Changelog</Label>
                  <Textarea 
                    id="changelog" 
                    placeholder="Enter release notes (one per line)" 
                    rows={4} 
                    value={newRelease.changelog}
                    onChange={(e) => setNewRelease({ ...newRelease, changelog: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="minVersion">Min Supported Version</Label>
                    <Input 
                      id="minVersion" 
                      placeholder="e.g., 2.0.0" 
                      value={newRelease.minVersion}
                      onChange={(e) => setNewRelease({ ...newRelease, minVersion: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Initial Status</Label>
                    <Select value={newRelease.status} onValueChange={(v) => setNewRelease({ ...newRelease, status: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="staged">Staged</SelectItem>
                        <SelectItem value="live">Live</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Force Update</Label>
                    <p className="text-sm text-muted-foreground">Require users to update</p>
                  </div>
                  <Switch 
                    checked={newRelease.forceUpdate}
                    onCheckedChange={(checked) => setNewRelease({ ...newRelease, forceUpdate: checked })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Release</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Preview Release Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Release Preview</DialogTitle>
            <DialogDescription>
              Preview release details before deployment
            </DialogDescription>
          </DialogHeader>
          {previewRelease && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Version</Label>
                  <p className="font-mono font-bold text-lg">v{previewRelease.version}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Platform</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {getPlatformIcon(previewRelease.platform)}
                    <span className="capitalize font-medium">{previewRelease.platform === "ios" ? "iOS" : previewRelease.platform}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(previewRelease.status)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Release Date</Label>
                  <p className="font-medium mt-1">{previewRelease.releaseDate.toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Min Supported Version</Label>
                <p className="font-mono mt-1">{previewRelease.minSupportedVersion}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-muted-foreground">Force Update:</Label>
                  <Badge variant={previewRelease.forceUpdate ? "destructive" : "outline"}>
                    {previewRelease.forceUpdate ? "Yes" : "No"}
                  </Badge>
                </div>
                {previewRelease.downloadCount !== undefined && (
                  <div className="flex items-center gap-2">
                    <Label className="text-muted-foreground">Downloads:</Label>
                    <span className="font-medium">{previewRelease.downloadCount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-muted-foreground">Changelog</Label>
                <ul className="mt-2 space-y-2 p-4 rounded-lg bg-secondary/30">
                  {previewRelease.changelog.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                  Close
                </Button>
                {previewRelease.status === "staged" && (
                  <Button onClick={() => {
                    handleDeploy(previewRelease.id)
                    setPreviewOpen(false)
                  }}>
                    <Rocket className="h-4 w-4 mr-1" />
                    Deploy Now
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{releases.filter((r) => r.status === "live").length}</p>
              <p className="text-sm text-muted-foreground">Live Releases</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{releases.filter((r) => r.status === "staged").length}</p>
              <p className="text-sm text-muted-foreground">Staged</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-1/10">
              <Download className="h-5 w-5 text-chart-1" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {releases.reduce((sum, r) => sum + (r.downloadCount || 0), 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Downloads</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-2/10">
              <ToggleLeft className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {featureToggles.filter((f) => f.enabled).length}/{featureToggles.length}
              </p>
              <p className="text-sm text-muted-foreground">Features Enabled</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="releases">
        <TabsList>
          <TabsTrigger value="releases">Releases</TabsTrigger>
          <TabsTrigger value="features">Feature Toggles</TabsTrigger>
        </TabsList>

        <TabsContent value="releases" className="space-y-4">
          {/* Releases by Platform */}
          {["android", "ios", "web"].map((platform) => {
            const platformReleases = releases.filter((r) => r.platform === platform)
            if (platformReleases.length === 0) return null

            return (
              <Card key={platform}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 capitalize">
                    {getPlatformIcon(platform)}
                    {platform === "ios" ? "iOS" : platform} Releases
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {platformReleases.map((release) => (
                      <div
                        key={release.id}
                        className="flex items-start justify-between p-4 border border-border rounded-lg"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-lg">v{release.version}</span>
                            {getStatusBadge(release.status)}
                            {release.forceUpdate && (
                              <Badge
                                variant="outline"
                                className="bg-destructive/10 text-destructive border-destructive/30"
                              >
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Force Update
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Released: {release.releaseDate.toLocaleDateString()}
                            {release.downloadCount && ` • ${release.downloadCount.toLocaleString()} downloads`}
                          </div>
                          <ul className="text-sm space-y-1 mt-2">
                            {release.changelog.map((item, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handlePreview(release)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          {release.status === "staged" && (
                            <Button size="sm" onClick={() => handleDeploy(release.id)}>
                              <Rocket className="h-4 w-4 mr-1" />
                              Deploy
                            </Button>
                          )}
                          {release.status === "live" && (
                            <Button variant="outline" size="sm" disabled>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Deployed
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Feature Toggles</CardTitle>
                  <CardDescription>Enable or disable features across platforms</CardDescription>
                </div>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featureToggles.map((feature) => (
                  <div
                    key={feature.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm bg-secondary px-2 py-1 rounded">{feature.name}</span>
                        <div className="flex gap-1">
                          {feature.platforms.map((p) => (
                            <Badge key={p} variant="outline" className="text-xs capitalize">
                              {p}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                      {feature.enabled && feature.rolloutPercentage < 100 && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">Rollout:</span>
                          <div className="flex-1 max-w-32 h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${feature.rolloutPercentage}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{feature.rolloutPercentage}%</span>
                        </div>
                      )}
                    </div>
                    <Switch
                      checked={feature.enabled}
                      onCheckedChange={(checked) =>
                        setFeatureToggles((prev) =>
                          prev.map((f) => (f.id === feature.id ? { ...f, enabled: checked } : f)),
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
