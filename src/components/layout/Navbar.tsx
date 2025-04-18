
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Menu, X, User, LogOut, UserCircle, Settings } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-brand-purple to-brand-blue"></div>
            <span className="font-bold text-xl">CO-brew</span>
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <Link to="/discover" className="text-gray-600 hover:text-gray-900">Discover</Link>
            <Link to="/projects" className="text-gray-600 hover:text-gray-900">Projects</Link>
            <Link to="/teams" className="text-gray-600 hover:text-gray-900">Teams</Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/projects")}>
            <Search className="h-5 w-5" />
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <UserCircle className="h-4 w-4" />
                  <span>{user.user_metadata?.first_name || 'Account'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Complete Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </div>
        
        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile menu */}
      <div className={cn(
        "md:hidden absolute inset-x-0 bg-white border-b z-50 transition-all duration-300 ease-in-out",
        isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
      )}>
        <div className="container mx-auto px-4 py-3 flex flex-col space-y-4">
          <Link to="/discover" className="text-gray-600 hover:text-gray-900 py-2">Discover</Link>
          <Link to="/projects" className="text-gray-600 hover:text-gray-900 py-2">Projects</Link>
          <Link to="/teams" className="text-gray-600 hover:text-gray-900 py-2">Teams</Link>
          <Link to="/about" className="text-gray-600 hover:text-gray-900 py-2">About</Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 py-2">Dashboard</Link>
              <Link to="/profile" className="text-gray-600 hover:text-gray-900 py-2 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Complete Profile
              </Link>
              <Link to="/settings" className="text-gray-600 hover:text-gray-900 py-2">Settings</Link>
              <Button onClick={handleLogout}>Log out</Button>
            </>
          ) : (
            <div className="flex flex-col space-y-2 pt-4">
              <Link to="/login">
                <Button variant="outline" className="w-full">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button className="w-full">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
