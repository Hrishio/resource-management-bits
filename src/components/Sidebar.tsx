
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  BarChart3,
  Settings,
  HelpCircle,
  UserCog,
  X
} from "lucide-react";
import { useRole } from "@/hooks/useRole";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose }: SidebarProps) => {
  const { isAdmin } = useRole();
  
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, adminOnly: true },
    { id: "resources", label: "Resources", icon: Users, adminOnly: true },
    { id: "projects", label: "Projects", icon: Briefcase, adminOnly: false },
    { id: "user-management", label: "User Management", icon: UserCog, adminOnly: true },
    { id: "analytics", label: "Analytics", icon: BarChart3, adminOnly: true },
    { id: "settings", label: "Settings", icon: Settings, adminOnly: false },
    { id: "help", label: "Help", icon: HelpCircle, adminOnly: false }
  ].filter(item => !item.adminOnly || isAdmin);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card shadow-lg transform transition-transform duration-300 ease-in-out lg:transform-none",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">ResourceHub</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isAdmin ? "Admin Portal" : "Resource Portal"}
            </p>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md hover:bg-accent text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                onClose(); // Close sidebar on mobile after selection
              }}
              className={cn(
                "w-full flex items-center px-6 py-3 text-left hover:bg-accent transition-colors duration-200",
                activeTab === item.id 
                  ? "bg-primary/10 text-primary border-r-2 border-primary" 
                  : "text-foreground hover:text-primary"
              )}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};
