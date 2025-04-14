
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-brand-purple to-brand-blue"></div>
            <span className="font-bold text-xl">CollabHub</span>
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <Link to="/discover" className="text-gray-600 hover:text-gray-900">Discover</Link>
            <Link to="/projects" className="text-gray-600 hover:text-gray-900">Projects</Link>
            <Link to="/teams" className="text-gray-600 hover:text-gray-900">Teams</Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Link to="/login">
            <Button variant="outline">Log in</Button>
          </Link>
          <Link to="/signup">
            <Button>Sign up</Button>
          </Link>
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
          <div className="flex flex-col space-y-2 pt-4">
            <Link to="/login">
              <Button variant="outline" className="w-full">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button className="w-full">Sign up</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
