import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, Users, DollarSign, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  budget: string | null;
  start_date: string | null;
  end_date: string | null;
  team_size: number;
  progress: number;
  created_at: string;
}

export const ProjectAssignments = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isAdmin } = useRole();
  const { user } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, [isAdmin, user]);

  const fetchProjects = async () => {
    try {
      if (isAdmin) {
        // Admins can see all projects
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } else if (user) {
        // Resource users only see projects they are assigned to
        // First, get the resource record for this user
        const { data: resource, error: resourceError } = await supabase
          .from("resources")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (resourceError) throw resourceError;

        if (resource) {
          // Get projects assigned to this resource
          const { data: projectAssignments, error: assignmentError } = await supabase
            .from("project_resources")
            .select(`
              project_id,
              projects (*)
            `)
            .eq("resource_id", resource.id);

          if (assignmentError) throw assignmentError;

          // Extract projects from the assignments
          const assignedProjects = projectAssignments?.map(assignment => assignment.projects).filter(Boolean) || [];
          setProjects(assignedProjects);
        } else {
          // No resource record found, show empty
          setProjects([]);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch projects. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project deleted successfully!",
      });
      
      fetchProjects();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-green-100 text-green-800";
      case "planning": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-gray-100 text-gray-800";
      case "on-hold": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl lg:text-2xl font-bold text-foreground">Project Management</h2>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No projects found</p>
          <p className="text-sm text-muted-foreground/80">Create your first project to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base lg:text-lg mb-2 truncate">{project.name}</CardTitle>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  {isAdmin && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => deleteProject(project.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3 lg:space-y-4">
                <p className="text-xs lg:text-sm text-muted-foreground line-clamp-2">
                  {project.description || "No description provided"}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs lg:text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-1.5 lg:h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs lg:text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground" />
                    <span className="truncate">{project.budget || "No budget"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground" />
                    <span>{project.team_size} members</span>
                  </div>
                </div>
                
                {(project.start_date || project.end_date) && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="truncate">
                      {project.start_date || "No start"} - {project.end_date || "No end"}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};