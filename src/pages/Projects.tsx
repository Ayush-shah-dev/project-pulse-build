import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import ProjectCard from "@/components/project/ProjectCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  stage: string;
  roles_needed: string[];
  updated_at: string;
  creator_id: string;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("updated_at", { ascending: false });

        if (error) {
          throw error;
        }

        setProjects(data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast({
          title: "Error",
          description: "Failed to fetch projects",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  const filteredProjects = projects.filter((project) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      project.title.toLowerCase().includes(searchTerm) ||
      project.description.toLowerCase().includes(searchTerm) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
      project.stage.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Explore Projects</h1>
            <p className="text-muted-foreground">
              Discover projects to collaborate on or create your own
            </p>
          </div>
          <Button asChild className="flex gap-2">
            <Link to="/create-project">
              <Plus className="h-5 w-5" />
              Create Project
            </Link>
          </Button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search projects..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterExpanded(!filterExpanded)}
              className="hidden md:flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>
          {filterExpanded && (
            <div className="mt-4 p-4 bg-muted/30 rounded-md">
              {/* Add filter components here */}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold mb-4">All Projects</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-80 rounded-lg border border-gray-200 bg-white p-4"
                >
                  <div className="h-full animate-pulse">
                    <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                    <div className="mt-4 h-24 rounded bg-gray-200"></div>
                    <div className="mt-4 h-4 w-1/2 rounded bg-gray-200"></div>
                    <div className="mt-2 h-4 w-1/4 rounded bg-gray-200"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  description={project.description}
                  tags={project.tags || []}
                  stage={project.stage}
                  rolesNeeded={project.roles_needed}
                  updatedAt={project.updated_at}
                  creatorId={project.creator_id}
                />
              ))}
            </div>
          ) : (
            <div className="my-12 text-center">
              <p className="text-lg font-medium">No projects found</p>
              <p className="text-muted-foreground mt-2">
                Try adjusting your filters or create a new project
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Projects;
