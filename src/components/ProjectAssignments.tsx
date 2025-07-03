
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Users, DollarSign, Clock } from "lucide-react";

const projects = [
  {
    id: 1,
    name: "Mobile App Redesign",
    status: "Active",
    progress: 65,
    budget: "$250,000",
    spent: "$162,500",
    deadline: "2024-08-15",
    team: [
      { name: "Sarah Johnson", role: "Lead Developer", allocation: 80 },
      { name: "Lisa Rodriguez", role: "UI/UX Designer", allocation: 90 },
      { name: "Mike Chen", role: "Backend Developer", allocation: 60 }
    ],
    resources: [
      { name: "Design Workstation", type: "Equipment", cost: "$15/day" },
      { name: "Conference Room B", type: "Facility", cost: "$25/hr" }
    ]
  },
  {
    id: 2,
    name: "Cloud Migration",
    status: "Planning",
    progress: 25,
    budget: "$500,000",
    spent: "$125,000",
    deadline: "2024-12-31",
    team: [
      { name: "David Kim", role: "DevOps Engineer", allocation: 100 },
      { name: "Anna Smith", role: "Cloud Architect", allocation: 75 },
      { name: "Tom Wilson", role: "Security Specialist", allocation: 50 }
    ],
    resources: [
      { name: "AWS Credits", type: "Cloud Resources", cost: "$2000/month" },
      { name: "Migration Tools", type: "Software", cost: "$500/month" }
    ]
  },
  {
    id: 3,
    name: "Data Analytics Platform",
    status: "Active",
    progress: 80,
    budget: "$180,000",
    spent: "$144,000",
    deadline: "2024-07-30",
    team: [
      { name: "Emma Davis", role: "Data Engineer", allocation: 95 },
      { name: "John Brown", role: "Analytics Specialist", allocation: 70 }
    ],
    resources: [
      { name: "Data Storage", type: "Infrastructure", cost: "$800/month" },
      { name: "Analytics Software", type: "Software", cost: "$1200/month" }
    ]
  }
];

export const ProjectAssignments = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Planning": return "bg-blue-100 text-blue-800";
      case "Completed": return "bg-gray-100 text-gray-800";
      case "On Hold": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const calculateBudgetPercentage = (spent: string, budget: string) => {
    const spentAmount = parseFloat(spent.replace(/[$,]/g, ''));
    const budgetAmount = parseFloat(budget.replace(/[$,]/g, ''));
    return (spentAmount / budgetAmount) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Project Assignments</h2>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Create New Project
        </Button>
      </div>

      <div className="grid gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      Due: {new Date(project.deadline).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{project.progress}%</p>
                  <p className="text-sm text-gray-600">Complete</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Project Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                {/* Budget Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Budget Overview
                      </h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Budget:</span>
                        <span className="font-medium">{project.budget}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Spent:</span>
                        <span className="font-medium">{project.spent}</span>
                      </div>
                      <Progress 
                        value={calculateBudgetPercentage(project.spent, project.budget)} 
                        className="h-2 mt-2"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium flex items-center mb-2">
                      <Users className="w-4 h-4 mr-2" />
                      Team Members
                    </h4>
                    <div className="space-y-2">
                      {project.team.map((member, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-gray-600">{member.role}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {member.allocation}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Resources */}
                <div>
                  <h4 className="font-medium mb-3">Allocated Resources</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {project.resources.map((resource, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{resource.name}</p>
                          <p className="text-sm text-gray-600">{resource.type}</p>
                        </div>
                        <span className="text-sm font-medium text-blue-600">{resource.cost}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button variant="outline" size="sm">Edit Assignment</Button>
                  <Button variant="outline" size="sm">
                    <Clock className="w-4 h-4 mr-2" />
                    Time Tracking
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
