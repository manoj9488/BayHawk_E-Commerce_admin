"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Award, Clock, Package, Truck } from "lucide-react"

const teamPerformance = [
  {
    id: "1",
    name: "Rajesh Kumar",
    role: "Delivery",
    ordersCompleted: 145,
    avgTime: "28 min",
    rating: 4.8,
    efficiency: 92,
    trend: "up",
  },
  {
    id: "2",
    name: "Priya Sharma",
    role: "Packing",
    ordersCompleted: 234,
    avgTime: "12 min",
    rating: 4.9,
    efficiency: 95,
    trend: "up",
  },
  {
    id: "3",
    name: "Arun Patel",
    role: "Procurement",
    ordersCompleted: 89,
    avgTime: "45 min",
    rating: 4.6,
    efficiency: 88,
    trend: "down",
  },
  {
    id: "4",
    name: "Lakshmi Reddy",
    role: "Delivery",
    ordersCompleted: 132,
    avgTime: "32 min",
    rating: 4.7,
    efficiency: 90,
    trend: "up",
  },
]

export default function TeamPerformancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team Performance</h1>
        <p className="text-muted-foreground">Monitor team member performance and productivity metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">600</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">29 min</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">-5%</span> faster
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Team Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3%</span> improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.75</div>
            <p className="text-xs text-muted-foreground">Out of 5.0</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {teamPerformance.map((member) => (
              <div key={member.id} className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {member.role}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {member.ordersCompleted} orders
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-bold">{member.efficiency}%</span>
                        {member.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Efficiency</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Performance</span>
                      <span className="font-medium">{member.efficiency}%</span>
                    </div>
                    <Progress value={member.efficiency} className="h-2" />
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Avg: {member.avgTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      Rating: {member.rating}/5.0
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
