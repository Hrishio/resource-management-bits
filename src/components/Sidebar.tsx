
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  BarChart3,
  Settings,
  HelpCircle,
  UserCog
} from "lucide-react";
import { useRole } from "@/hooks/useRole";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const { isAdmin } = useRole();
  
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, adminOnly: true },
    { id: "resources", label: "Resources", icon: Users, adminOnly: true },
    { id: "projects", label: "Projects", icon: Briefcase, adminOnly: false },
    { id: "user-management", label: "User Management", icon: UserCog, adminOnly: true },
    { id: "analytics", label: "Analytics", icon: BarChart3, adminOnly: true },
    { id: "settings", label: "Settings", icon: Settings, adminOnly: true },
    { id: "help", label: "Help", icon: HelpCircle, adminOnly: false }
  ].filter(item => !item.adminOnly || isAdmin);

  return (
    <div className="w-64 bg-white shadow-lg h-screen">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-900">ResourceHub</h2>
        <p className="text-sm text-gray-600 mt-1">
          {isAdmin ? "Admin Portal" : "Resource Portal"}
        </p>
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
