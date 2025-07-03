
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const resources = [
  {
    id: 1,
    name: "Sarah Johnson",
    type: "Developer",
    skills: ["React", "Node.js", "TypeScript"],
    status: "Available",
    allocation: 75,
    project: "Mobile App Redesign",
    cost: "$85/hr"
  },
  {
    id: 2,
    name: "Design Workstation",
    type: "Equipment",
    skills: ["Adobe Creative Suite", "High-end Graphics"],
    status: "In Use",
    allocation: 100,
    project: "Brand Identity",
    cost: "$15/day"
  },
  {
    id: 3,
    name: "Mike Chen",
    type: "Developer",
    skills: ["Python", "Django", "AWS"],
    status: "Available",
    allocation: 50,
    project: "Data Platform",
    cost: "$90/hr"
  },
  {
    id: 4,
    name: "Conference Room A",
    type: "Facility",
    skills: ["Video Conferencing", "20 person capacity"],
    status: "Available",
    allocation: 30,
    project: "Client Meetings",
    cost: "$25/hr"
  },
  {
    id: 5,
    name: "Lisa Rodriguez",
    type: "Designer",
    skills: ["UI/UX", "Figma", "Prototyping"],
    status: "Busy",
    allocation: 90,
    project: "Mobile App Redesign",
    cost: "$75/hr"
  }
];

export const ResourceTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === "All" || resource.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return "bg-green-100 text-green-800";
      case "Busy": return "bg-red-100 text-red-800";
      case "In Use": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Resource Management</span>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  {selectedType}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedType("All")}>All Types</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedType("Developer")}>Developers</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedType("Designer")}>Designers</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedType("Equipment")}>Equipment</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedType("Facility")}>Facilities</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Skills/Features</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Allocation</TableHead>
              <TableHead>Current Project</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResources.map((resource) => (
              <TableRow key={resource.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{resource.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{resource.type}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {resource.skills.map((skill, index) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(resource.status)}>
                    {resource.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${resource.allocation}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{resource.allocation}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-600">{resource.project}</TableCell>
                <TableCell className="font-medium">{resource.cost}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
