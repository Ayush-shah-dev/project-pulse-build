
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in">
              Connect. Collaborate. Create.
            </h1>
            <p className="mt-6 text-lg md:text-xl max-w-lg opacity-90 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Find like-minded people, form teams, and build amazing projects together. Your next big idea starts with the right collaboration.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/discover">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20">
                  Explore Projects
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10 bg-white rounded-lg shadow-xl overflow-hidden animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="bg-brand-purple p-2 flex items-center">
                <div className="h-3 w-3 rounded-full bg-red-400 mx-1"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-400 mx-1"></div>
                <div className="h-3 w-3 rounded-full bg-green-400 mx-1"></div>
                <div className="mx-auto text-white text-sm font-medium">Project Workspace</div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-4">
                    <div className="h-8 bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-40 bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-24 bg-gray-100 rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-32 bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-16 bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-24 bg-gray-100 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="mt-4 flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-gray-200"></div>
                  ))}
                  <div className="h-8 w-8 rounded-full border-2 border-white bg-brand-purple flex items-center justify-center text-white text-xs">+3</div>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -left-6 h-24 w-24 bg-brand-blue/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -right-8 h-40 w-40 bg-brand-purple/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
