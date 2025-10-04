import { useQuery } from "@tanstack/react-query";
import { queryMongoDB } from "@/hooks/useMongoDB";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  HelpCircle, 
  MessageSquare, 
  Users,
  TrendingUp,
  Activity,
  ArrowRight,
  Database
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["admin-categories-count"],
    queryFn: async () => {
      const result = await queryMongoDB({
        collection: "questions_categories",
        operation: "count",
        query: {}
      });
      return result;
    },
  });

  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ["admin-questions-count"],
    queryFn: async () => {
      const result = await queryMongoDB({
        collection: "questions",
        operation: "count",
        query: {}
      });
      return result;
    },
  });

  const { data: answers, isLoading: answersLoading } = useQuery({
    queryKey: ["admin-answers-count"],
    queryFn: async () => {
      const result = await queryMongoDB({
        collection: "answers",
        operation: "count",
        query: {}
      });
      return result;
    },
  });

  const stats = [
    {
      name: "Categories",
      value: categories || 0,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      href: "/admin/categories"
    },
    {
      name: "Questions",
      value: questions || 0,
      icon: HelpCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
      href: "/admin/questions"
    },
    {
      name: "Answers",
      value: answers || 0,
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      href: "/admin/answers"
    },
    {
      name: "Users",
      value: 0,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      href: "/admin/users"
    }
  ];

  const quickActions = [
    {
      title: "Manage Categories",
      description: "View and edit all question categories",
      href: "/admin/categories",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Manage Questions",
      description: "View and edit questions with pagination",
      href: "/admin/questions",
      icon: HelpCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Manage Answers",
      description: "View and edit question answers",
      href: "/admin/answers",
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Bulk Operations",
      description: "Import/export and bulk operations",
      href: "/admin/bulk",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage your driving school test system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.name} to={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} to={action.href}>
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-0 shadow-md hover:shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${action.bgColor}`}>
                        <Icon className={`h-6 w-6 ${action.color}`} />
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <Card>
          <CardHeader>
            <CardTitle>System Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">System started successfully</span>
                </div>
                <span className="text-xs text-gray-500">Just now</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Database connection established</span>
                </div>
                <span className="text-xs text-gray-500">2 minutes ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Admin panel loaded</span>
                </div>
                <span className="text-xs text-gray-500">5 minutes ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
