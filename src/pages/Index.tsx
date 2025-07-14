import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  PlusCircle,
  TrendingUp, 
  DollarSign,
  Briefcase,
  Calendar,
  BarChart3,
  LogOut,
  Menu
} from "lucide-react";
import { ResourceChart } from "@/components/ResourceChart";
import { ResourceTable } from "@/components/ResourceTable";
import { ProjectAssignments } from "@/components/ProjectAssignments";
import { ResourceForm } from "@/components/ResourceForm";
import { ProjectForm } from "@/components/ProjectForm";
import { ResourceAssignment } from "@/components/ResourceAssignment";
import { Sidebar } from "@/components/Sidebar";
import { UserManagement } from "@/components/UserManagement";
import { Settings } from "@/components/Settings";
import { Help } from "@/components/Help";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <div className="lg:hidden bg-card border-b border-border p-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">ResourceHub</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(true)}
          className="p-2"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 lg:mb-8 gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Resource Management Portal</h1>
                <p className="text-muted-foreground mt-1 text-sm lg:text-base">Welcome back, {user.email}</p>
                <p className="text-xs text-muted-foreground mt-1">Role: {role?.charAt(0).toUpperCase() + role?.slice(1)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {isAdmin && (
                  <>
                    <Button onClick={() => setShowResourceForm(true)} size="sm" className="text-xs lg:text-sm">
                      <PlusCircle className="w-4 h-4 mr-1 lg:mr-2" />
                      Add Resource
                    </Button>
                    <Button onClick={() => setShowProjectForm(true)} size="sm" className="text-xs lg:text-sm">
                      <PlusCircle className="w-4 h-4 mr-1 lg:mr-2" />
                      Add Project
                    </Button>
                    <Button onClick={() => setShowResourceAssignment(true)} size="sm" className="text-xs lg:text-sm">
                      <Users className="w-4 h-4 mr-1 lg:mr-2" />
                      Assign Resources
                    </Button>
                  </>
                )}
                <Button onClick={signOut} variant="outline" size="sm" className="text-xs lg:text-sm">
                  <LogOut className="w-4 h-4 mr-1 lg:mr-2" />
                  Sign Out ({role})
                </Button>
              </div>
            </div>

            {activeTab === "dashboard" && isAdmin && (
              <div className="space-y-6 lg:space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  {stats.map((stat, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                      <CardContent className="p-4 lg:p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs lg:text-sm font-medium text-muted-foreground">{stat.title}</p>
                            <p className="text-xl lg:text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                            <p className="text-xs lg:text-sm text-green-600 mt-1">{stat.change}</p>
                          </div>
                          <stat.icon className={`w-6 h-6 lg:w-8 lg:h-8 ${stat.color}`} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-base lg:text-lg">
                        <BarChart3 className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                        Resource Utilization
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResourceChart />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-base lg:text-lg">
                        <Calendar className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                        Recent Projects
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 lg:space-y-4">
                        {recentProjects.map((project, index) => (
                          <div key={index} className="flex items-center justify-between p-2 lg:p-3 bg-muted/50 rounded-lg">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground text-sm lg:text-base truncate">{project.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge 
                                  variant={project.status === "Active" ? "default" : project.status === "Completed" ? "secondary" : "outline"}
                                  className="text-xs"
                                >
                                  {project.status}
                                </Badge>
                                <span className="text-xs lg:text-sm text-muted-foreground">{project.team} team members</span>
                              </div>
                              <Progress value={project.progress} className="mt-2 h-1.5 lg:h-2" />
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base lg:text-lg">Resource Allocation Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResourceChart />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base lg:text-lg">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 lg:space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-sm lg:text-base">Team Productivity</span>
                        <span className="font-semibold text-sm lg:text-base">92%</span>
                      </div>
                      <Progress value={92} className="h-1.5 lg:h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-sm lg:text-base">Resource Efficiency</span>
                        <span className="font-semibold text-sm lg:text-base">87%</span>
                      </div>
                      <Progress value={87} className="h-1.5 lg:h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-sm lg:text-base">Budget Utilization</span>
                        <span className="font-semibold text-sm lg:text-base">78%</span>
                      </div>
                      <Progress value={78} className="h-1.5 lg:h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "settings" && (
              <div>
                <Settings />
              </div>
            )}

            {activeTab === "help" && (
              <div>
                <Help />
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