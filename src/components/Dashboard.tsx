import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ChatInterface from "./ChatInterface";
import AgentInterface from "./AgentInterface";
import {
  ArrowRight,
  Bell,
  Calendar,
  Lightbulb,
} from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("agent");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome to Your Dashboard</h1>

      <Tabs
        defaultValue="agent"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-8"
      >
        <TabsList>
          <TabsTrigger value="agent">AI Agent</TabsTrigger>
          <TabsTrigger value="chat">Chat Assistant</TabsTrigger>
          <TabsTrigger value="insights">Business Insights</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        {/* Agent Tab */}
        <TabsContent value="agent" className="space-y-6 focus:outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3">
              <AgentInterface />
            </div>
          </div>
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat" className="space-y-6 focus:outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChatInterface />
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Suggested Actions</CardTitle>
                  <CardDescription>Based on recent conversations</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li>
                      <ActionItem
                        icon={<Bell className="h-4 w-4" />}
                        title="Review competitor analysis"
                        description="Complete marketing strategy update"
                        time="2 days ago"
                        priority="high"
                      />
                    </li>
                    <li>
                      <ActionItem
                        icon={<Calendar className="h-4 w-4" />}
                        title="Schedule investor meeting"
                        description="Prepare pitch deck for Series A"
                        time="1 day ago"
                        priority="medium"
                      />
                    </li>
                    <li>
                      <ActionItem
                        icon={<Lightbulb className="h-4 w-4" />}
                        title="Analyze user feedback"
                        description="Prioritize roadmap features"
                        time="Just now"
                        priority="low"
                      />
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Recent Insights</CardTitle>
                  <CardDescription>Generated from your data</CardDescription>
                </CardHeader>
                <CardContent>
                  <InsightItem
                    title="Conversion Rate Increased"
                    value="+12%"
                    trend="up"
                    description="Your recent landing page change is performing well"
                  />
                  <InsightItem
                    title="Customer Acquisition Cost"
                    value="-8%"
                    trend="up"
                    description="Facebook ads optimization is working"
                  />
                  <div className="mt-4">
                    <Button variant="link" className="p-0 h-auto flex items-center">
                      View all insights
                      <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="focus:outline-none">
          {/* TODO: Add Insights tab content here */}
          <p>Insights feature coming soon...</p>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="focus:outline-none">
          {/* TODO: Add Calendar tab content here */}
          <p>Calendar feature coming soon...</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ActionItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  priority: "high" | "medium" | "low";
}

const ActionItem = ({
  icon,
  title,
  description,
  time,
  priority,
}: ActionItemProps) => {
  return (
    <div className="flex items-start space-x-3 p-3 border rounded-md bg-muted">
      <div className="text-muted-foreground">{icon}</div>
      <div className="flex-1">
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
        <div className="text-xs text-gray-400 mt-1">
          {time} • Priority: {priority}
        </div>
      </div>
    </div>
  );
};

interface InsightItemProps {
  title: string;
  value: string;
  trend: "up" | "down";
  description: string;
}

const InsightItem = ({
  title,
  value,
  trend,
  description,
}: InsightItemProps) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between">
        <div className="font-medium">{title}</div>
        <div
          className={`font-semibold ${
            trend === "up" ? "text-green-500" : "text-red-500"
          }`}
        >
          {value}
        </div>
      </div>
      <div className="text-sm text-muted-foreground">{description}</div>
    </div>
  );
};

export default Dashboard;
