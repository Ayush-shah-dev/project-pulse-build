
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import ProjectCard from "@/components/project/ProjectCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, SlidersHorizontal, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProjectMember {
  id: string;
  name: string;
  avatar: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  stage: "idea" | "prototype" | "mvp" | "launched";
  members: ProjectMember[];
  rolesNeeded: string[];
  matchScore: number;
  updatedAt: string;
}

const Projects = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState<string>("all");
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        
        // Fetch projects from Supabase
        const { data: projectsData, error } = await supabase
          .from('projects')
          .select(`
            id, 
            title, 
            description, 
            tags, 
            stage, 
            roles_needed,
            updated_at,
            creator_id
          `)
          .order('updated_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (projectsData) {
          // For each project, fetch creator profile
          const projectsWithMembers = await Promise.all(
            projectsData.map(async (project) => {
              // Fetch creator profile
              const { data: profileData } = await supabase
                .from('profile_details')
                .select('first_name, last_name, id')
                .eq('id', project.creator_id)
                .single();

              // Generate a random match score for demo purposes
              const matchScore = Math.floor(Math.random() * 30) + 70;
              
              return {
                id: project.id,
                title: project.title,
                description: project.description,
                tags: project.tags || [],
                stage: project.stage,
                members: profileData ? [{
                  id: profileData.id,
                  name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Anonymous User',
                  avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`
                }] : [],
                rolesNeeded: project.roles_needed || [],
                matchScore: matchScore,
                updatedAt: project.updated_at
              };
            })
          );

          setProjects(projectsWithMembers);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: 'Error',
          description: 'Failed to load projects',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  // Filter projects based on search query and selected stage
  const filteredProjects = projects.filter(project => {
    const matchesStage = selectedStage === "all" || project.stage === selectedStage;
    const matchesSearch = searchQuery === "" || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesStage && matchesSearch;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Open Projects</h1>
            <p className="text-muted-foreground">
              Discover projects looking for collaborators or start your own.
            </p>
          </div>
          <Link to="/projects/create">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, description, or tags..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setFilterExpanded(!filterExpanded)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <Badge 
            variant={selectedStage === "all" ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => setSelectedStage("all")}
          >
            All Stages
          </Badge>
          <Badge 
            variant={selectedStage === "idea" ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => setSelectedStage("idea")}
          >
            Idea
          </Badge>
          <Badge 
            variant={selectedStage === "prototype" ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => setSelectedStage("prototype")}
          >
            Prototype
          </Badge>
          <Badge 
            variant={selectedStage === "mvp" ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => setSelectedStage("mvp")}
          >
            MVP
          </Badge>
          <Badge 
            variant={selectedStage === "launched" ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => setSelectedStage("launched")}
          >
            Launched
          </Badge>
        </div>

        {filterExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-muted/30 rounded-md">
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="health">Healthcare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="social">Social Impact</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Skills Needed</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Any Skills" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dev">Development</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="data">Data Science</SelectItem>
                  <SelectItem value="pm">Project Management</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Sort By</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Match Score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Match Score</SelectItem>
                  <SelectItem value="recent">Recently Updated</SelectItem>
                  <SelectItem value="members">Team Size</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading projects...</span>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                description={project.description}
                tags={project.tags}
                stage={project.stage}
                members={project.members}
                rolesNeeded={project.rolesNeeded}
                matchScore={project.matchScore}
                updatedAt={project.updatedAt}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/20 rounded-lg">
            <h3 className="text-xl font-medium mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || selectedStage !== "all" 
                ? "No projects match your search criteria. Try adjusting your filters."
                : "No projects have been created yet. Be the first to share your idea!"}
            </p>
            <Link to="/projects/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Project
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Projects;
