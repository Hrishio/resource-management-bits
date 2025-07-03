
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  BarChart3,
  Settings,
  HelpCircle
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "resources", label: "Resources", icon: Users },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "help", label: "Help", icon: HelpCircle }
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-900">ResourceHub</h2>
        <p className="text-sm text-gray-600 mt-1">Project Management</p>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors duration-200",
              activeTab === item.id 
                ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" 
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};
