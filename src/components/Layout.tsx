
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Car, Clock } from "lucide-react";

const Layout = () => {
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-background flex">
      {/* Navigation sidebar */}
      <div className="bg-sidebar w-16 lg:w-64 shrink-0 border-r border-sidebar-border flex flex-col">
        <div className="h-16 flex items-center justify-center lg:justify-start px-4 border-b border-sidebar-border">
          <span className="hidden lg:block auto-astra-title text-redTheme-500">AutoAstra</span>
          <Car className="lg:hidden w-6 h-6 text-redTheme-500" />
        </div>
        
        <div className="flex flex-col gap-2 p-2">
          <Link
            to="/"
            className={`flex items-center p-3 rounded-md transition-colors ${
              location.pathname === "/"
                ? "bg-redTheme-700/20 text-redTheme-400"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            <Car className="w-5 h-5 mr-3" />
            <span className="hidden lg:block">Live Monitor</span>
          </Link>
          
          <Link
            to="/history"
            className={`flex items-center p-3 rounded-md transition-colors ${
              location.pathname === "/history"
                ? "bg-redTheme-700/20 text-redTheme-400"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            <Clock className="w-5 h-5 mr-3" />
            <span className="hidden lg:block">Log History</span>
          </Link>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
