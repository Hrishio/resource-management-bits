import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { HelpCircle, Send, Phone, Mail, FileText } from "lucide-react";

interface Project {
  id: string;
  name: string;
}

interface Manager {
  id: string;
  full_name: string;
  email: string;
}

export const Help = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  
  const [formData, setFormData] = useState({
    fullName: "",
    projectId: "",
    problemDescription: "",
    managerId: ""
  });

  useEffect(() => {
    fetchProjects();
    fetchManagers();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name")
        .order("name");

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchManagers = async () => {
    try {
      // First get all admin user IDs
      const { data: adminRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");

      if (rolesError) throw rolesError;

      if (adminRoles && adminRoles.length > 0) {
        // Then get their profiles
        const adminIds = adminRoles.map(role => role.user_id);
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .in("id", adminIds);

        if (profilesError) throw profilesError;
        setManagers(profiles || []);
      }
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  const submitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("support_tickets")
        .insert({
          user_id: user?.id,
          full_name: formData.fullName,
          project_id: formData.projectId === "none" ? null : formData.projectId || null,
          problem_description: formData.problemDescription,
          manager_id: formData.managerId === "none" ? null : formData.managerId || null
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Support ticket submitted successfully. We'll get back to you soon!",
      });

      // Reset form
      setFormData({
        fullName: "",
        projectId: "",
        problemDescription: "",
        managerId: ""
      });
    } catch (error) {
      console.error("Error submitting ticket:", error);
      toast({
        title: "Error",
        description: "Failed to submit support ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-foreground">Help & Support</h2>
        <p className="text-muted-foreground text-sm lg:text-base">Get help with your questions and report issues</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base lg:text-lg">
                <HelpCircle className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                Contact Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitTicket} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm lg:text-base">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    required
                    className="text-sm lg:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project" className="text-sm lg:text-base">Project (Optional)</Label>
                  <Select value={formData.projectId} onValueChange={(value) => setFormData({ ...formData, projectId: value })}>
                    <SelectTrigger className="text-sm lg:text-base">
                      <SelectValue placeholder="Select a project (if applicable)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No specific project</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="problem" className="text-sm lg:text-base">Problem Description</Label>
                  <Textarea
                    id="problem"
                    value={formData.problemDescription}
                    onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
                    placeholder="Describe the problem you're facing..."
                    rows={4}
                    required
                    className="text-sm lg:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manager" className="text-sm lg:text-base">Tag Manager (Optional)</Label>
                  <Select value={formData.managerId} onValueChange={(value) => setFormData({ ...formData, managerId: value })}>
                    <SelectTrigger className="text-sm lg:text-base">
                      <SelectValue placeholder="Select a manager to notify" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No specific manager</SelectItem>
                      {managers.map((manager) => (
                        <SelectItem key={manager.id} value={manager.id}>
                          {manager.full_name} ({manager.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" disabled={loading} className="w-full text-sm lg:text-base">
                  {loading ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Ticket
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Quick Help */}
        <div className="space-y-4 lg:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base lg:text-lg">Quick Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 lg:space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm lg:text-base">Phone Support</p>
                  <p className="text-xs lg:text-sm text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm lg:text-base">Email Support</p>
                  <p className="text-xs lg:text-sm text-muted-foreground">support@company.com</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base lg:text-lg">Documentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-xs lg:text-sm">
                <FileText className="w-4 h-4 mr-2" />
                User Guide
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs lg:text-sm">
                <FileText className="w-4 h-4 mr-2" />
                FAQ
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs lg:text-sm">
                <FileText className="w-4 h-4 mr-2" />
                Video Tutorials
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};