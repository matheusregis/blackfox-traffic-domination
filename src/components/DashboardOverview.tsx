import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Users, Shield, Globe, Zap } from "lucide-react";

const stats = [
  {
    title: "Total Clicks",
    value: "847,293",
    change: "+12.3%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Filtered Traffic",
    value: "89.2%",
    change: "+2.1%",
    trend: "up",
    icon: Shield,
  },
  {
    title: "Active Domains",
    value: "23",
    change: "-1",
    trend: "down",
    icon: Globe,
  },
  {
    title: "Success Rate",
    value: "94.7%",
    change: "+0.8%",
    trend: "up",
    icon: Zap,
  },
];

const recentActivity = [
  {
    domain: "offer1.example.com",
    filtered: 1247,
    passed: 543,
    status: "active",
  },
  {
    domain: "campaign2.net",
    filtered: 892,
    passed: 234,
    status: "active",
  },
  {
    domain: "promo3.io",
    filtered: 634,
    passed: 189,
    status: "paused",
  },
];

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back, John</h2>
        <p className="text-muted-foreground">Here's what's happening with your campaigns today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-card/50 border-primary/20 hover:shadow-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {stat.change}
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-primary/20">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{activity.domain}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.filtered} filtered • {activity.passed} passed
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    activity.status === "active" 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {activity.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-primary/20">
          <CardHeader>
            <CardTitle className="text-foreground">Plan Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Monthly Clicks</span>
                <span className="text-foreground">847,293 / 1,000,000</span>
              </div>
              <Progress value={84.7} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Active Domains</span>
                <span className="text-foreground">23 / 50</span>
              </div>
              <Progress value={46} className="h-2" />
            </div>
            
            <div className="pt-4 border-t border-primary/20">
              <p className="text-sm text-muted-foreground">
                You're on the <span className="text-primary font-medium">Pro Plan</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Plan resets in 14 days
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}