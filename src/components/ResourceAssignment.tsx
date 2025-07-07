import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, Users, X } from "lucide-react";

interface Resource {
  id: string;
  name: string;
  type: string;
  skills: string[] | null;
  availability: string;
  cost: string | null;
}

interface Project {
  id: string;
  name: string;
  status: string;
}

interface ResourceAssignmentProps {
  onClose: () => void;
  onAssignmentUpdated?: () => void;
}

export const ResourceAssignment = ({ onClose, onAssignmentUpdated }: ResourceAssignmentProps) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [assignedResources, setAssignedResources] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchProjectResources();
    }
  }, [selectedProject]);

  const fetchData = async () => {
    try {
      const [resourcesData, projectsData] = await Promise.all([
        supabase.from("resources").select("*").order("name"),
        supabase.from("projects").select("id, name, status").order("name")
      ]);

      if (resourcesData.error) throw resourcesData.error;
      if (projectsData.error) throw projectsData.error;

      setResources(resourcesData.data || []);
      setProjects(projectsData.data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const fetchProjectResources = async () => {
    try {
      const { data, error } = await supabase
        .from("project_resources")
        .select("resource_id")
        .eq("project_id", selectedProject);

      if (error) throw error;
      setAssignedResources(data.map(item => item.resource_id));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load project resources.",
        variant: "destructive"
      });
    }
  };

  const handleAssign = async () => {
    if (!selectedProject) {
      toast({
        title: "Error",
        description: "Please select a project first.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Remove existing assignments
      await supabase
        .from("project_resources")
        .delete()
        .eq("project_id", selectedProject);

      // Add new assignments
      if (assignedResources.length > 0) {
        const assignments = assignedResources.map(resourceId => ({
          project_id: selectedProject,
          resource_id: resourceId
        }));

        const { error } = await supabase
          .from("project_resources")
          .insert(assignments);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Resource assignments updated successfully!",
      });
      
      onAssignmentUpdated?.();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update assignments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleResourceAssignment = (resourceId: string) => {
    setAssignedResources(prev => 
      prev.includes(resourceId)
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (resource.skills && resource.skills.some(skill => 
                           skill.toLowerCase().includes(searchTerm.toLowerCase())
                         ));
    const matchesType = filterType === "All" || resource.type === filterType;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800";
      case "busy": return "bg-red-100 text-red-800";
      case "in-use": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Resource Assignment
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Project Selection */}
          <div className="space-y-2">
            <Label htmlFor="project">Select Project *</Label>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a project to assign resources" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name} ({project.status})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProject && (
            <>
              {/* Search and Filter */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value="Developer">Developers</SelectItem>
                    <SelectItem value="Designer">Designers</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Facility">Facilities</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Resource List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between text-sm text-gray-600 px-1">
                  <span>Available Resources ({filteredResources.length})</span>
                  <span>Selected: {assignedResources.length}</span>
                </div>
                
                {filteredResources.map((resource) => (
                  <div
                    key={resource.id}
                    className={`p-4 border rounded-lg transition-all ${
                      assignedResources.includes(resource.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Checkbox
                          checked={assignedResources.includes(resource.id)}
                          onCheckedChange={() => toggleResourceAssignment(resource.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{resource.name}</h4>
                            <Badge variant="outline">{resource.type}</Badge>
                            <Badge className={getStatusColor(resource.availability)}>
                              {resource.availability}
                            </Badge>
                          </div>
                          
                          {resource.skills && resource.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {resource.skills.map((skill, index) => (
                                <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          {resource.cost && (
                            <p className="text-sm text-gray-600">Cost: {resource.cost}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredResources.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No resources found matching your criteria.
                  </div>
                )}
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleAssign} 
              disabled={!selectedProject || loading}
              className="flex-1"
            >
              {loading ? "Updating..." : "Update Assignments"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};