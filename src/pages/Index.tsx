
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Settings, 
  PlusCircle, 
  TrendingUp, 
  DollarSign,
  Briefcase,
  Calendar,
  BarChart3,
  LogOut
} from "lucide-react";
import { ResourceChart } from "@/components/ResourceChart";
import { ResourceTable } from "@/components/ResourceTable";
import { ProjectAssignments } from "@/components/ProjectAssignments";
import { ResourceForm } from "@/components/ResourceForm";
import { ProjectForm } from "@/components/ProjectForm";
import { ResourceAssignment } from "@/components/ResourceAssignment";
import { Sidebar } from "@/components/Sidebar";
import { UserManagement } from "@/components/UserManagement";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showResourceAssignment, setShowResourceAssignment] = useState(false);
  const { user, loading, signOut } = useAuth();
  const { role, loading: roleLoading, isAdmin } = useRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Redirect non-admin users to projects tab
  useEffect(() => {
    if (!roleLoading && role === "resource" && activeTab !== "projects") {
      setActiveTab("projects");
    }
  }, [role, roleLoading, activeTab]);

  const stats = [
    {
      title: "Total Resources",
      value: "247",
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Projects",
      value: "18",
      change: "+3",
      icon: Briefcase,
      color: "text-green-600"
    },
    {
      title: "Budget Allocated",
      value: "$1.2M",
      change: "+8%",
      icon: DollarSign,
      color: "text-purple-600"
    },
    {
      title: "Utilization Rate",
      value: "87%",
      change: "+5%",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  const recentProjects = [
    { name: "Mobile App Redesign", status: "Active", progress: 65, team: 8 },
    { name: "Cloud Migration", status: "Planning", progress: 25, team: 12 },
    { name: "Data Analytics Platform", status: "Active", progress: 80, team: 6 },
    { name: "Security Audit", status: "Completed", progress: 100, team: 4 }
  ];

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Resource Management Portal</h1>
                <p className="text-gray-600 mt-1">Welcome back, {user.email}</p>
                <p className="text-xs text-gray-500 mt-1">Role: {role?.charAt(0).toUpperCase() + role?.slice(1)}</p>
              </div>
              <div className="flex gap-2">
                {isAdmin && (
                  <>
                    <Button onClick={() => setShowResourceForm(true)} className="bg-blue-600 hover:bg-blue-700">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Resource
                    </Button>
                    <Button onClick={() => setShowProjectForm(true)} className="bg-green-600 hover:bg-green-700">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                    <Button onClick={() => setShowResourceAssignment(true)} className="bg-purple-600 hover:bg-purple-700">
                      <Users className="w-4 h-4 mr-2" />
                      Assign Resources
                    </Button>
                  </>
                )}
                <Button onClick={signOut} variant="outline">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out ({role})
                </Button>
              </div>
            </div>

            {activeTab === "dashboard" && isAdmin && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                            <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                          </div>
                          <stat.icon className={`w-8 h-8 ${stat.color}`} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Resource Utilization
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResourceChart />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        Recent Projects
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentProjects.map((project, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{project.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge 
                                  variant={project.status === "Active" ? "default" : project.status === "Completed" ? "secondary" : "outline"}
                                  className="text-xs"
                                >
                                  {project.status}
                                </Badge>
                                <span className="text-sm text-gray-500">{project.team} team members</span>
                              </div>
                              <Progress value={project.progress} className="mt-2 h-2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "resources" && isAdmin && (
              <div>
                <ResourceTable />
              </div>
            )}

            {activeTab === "projects" && (
              <div>
                <ProjectAssignments />
              </div>
            )}

            {activeTab === "user-management" && isAdmin && (
              <div>
                <UserManagement />
              </div>
            )}

            {activeTab === "analytics" && isAdmin && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Resource Allocation Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResourceChart />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Team Productivity</span>
                        <span className="font-semibold">92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Resource Efficiency</span>
                        <span className="font-semibold">87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Budget Utilization</span>
                        <span className="font-semibold">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>

      {showResourceForm && (
        <ResourceForm onClose={() => setShowResourceForm(false)} />
      )}
      
      {showProjectForm && (
        <ProjectForm onClose={() => setShowProjectForm(false)} />
      )}
      
      {showResourceAssignment && (
        <ResourceAssignment onClose={() => setShowResourceAssignment(false)} />
      )}
    </div>
  );
};

export default Index;
