import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Plus, ArrowRight, Calendar, Users, BookOpen, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProjectNotifications from "@/components/project/ProjectNotifications";

interface Project {
  id: string;
  title: string;
  description: string;
  stage: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface Application {
  id: string;
  project_id: string;
  status: string;
  created_at: string;
  project: {
    title: string;
  };
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Fetch user's projects
        const { data: projectsData, error: projectsError } = await supabase
          .from("projects")
          .select("*")
          .eq("creator_id", user.id)
          .order("updated_at", { ascending: false });

        if (projectsError) throw projectsError;
        
        // Fetch user's applications data
        const { data: applicationsData, error: applicationsError } = await supabase
          .from("project_applications")
          .select(`
            id,
            project_id,
            status,
            created_at
          `)
          .eq("applicant_id", user.id)
          .order("created_at", { ascending: false });

        if (applicationsError) throw applicationsError;
        
        // If we have applications, get the project titles separately
        if (applicationsData && applicationsData.length > 0) {
          const completeApplications: Application[] = [];
          
          for (const app of applicationsData) {
            // Get project title for this application
            const { data: projectData, error: projectError } = await supabase
              .from("projects")
              .select("title")
              .eq("id", app.project_id)
              .single();
              
            if (projectError) {
              console.error("Error fetching project title:", projectError);
              continue;
            }
            
            completeApplications.push({
              ...app,
              project: { title: projectData.title }
            });
          }
          
          setApplications(completeApplications);
        } else {
          setApplications([]);
        }
        
        setProjects(projectsData || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, toast]);

  const getStageColor = (stage: string) => {
    const normalizedStage = stage.toLowerCase();
    switch (normalizedStage) {
      case "idea":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "prototype":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "mvp":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "launched":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading your dashboard...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 space-y-6">
              {user && <ProjectNotifications userId={user.id} />}
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Your Projects</CardTitle>
                    <CardDescription>
                      Projects you've created or are managing
                    </CardDescription>
                  </div>
                  <Button asChild>
                    <Link to="/create-project" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Create Project
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {projects.length === 0 ? (
                    <div className="text-center py-6">
                      <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Create your first project to start collaborating with others
                      </p>
                      <Button asChild>
                        <Link to="/create-project" className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Create Project
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {projects.slice(0, 3).map((project) => (
                        <div key={project.id} className="flex flex-col md:flex-row justify-between border rounded-lg p-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium">{project.title}</h3>
                              <Badge className={getStageColor(project.stage)}>
                                {project.stage.charAt(0).toUpperCase() + project.stage.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {project.description}
                            </p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              Updated {formatDate(project.updated_at)}
                            </div>
                          </div>
                          <div className="flex items-center mt-4 md:mt-0">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/projects/${project.id}`}>
                                View Project
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                {projects.length > 3 && (
                  <CardFooter>
                    <Button variant="ghost" asChild className="w-full">
                      <Link to="/projects" className="flex items-center justify-center">
                        View All Projects
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                )}
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Applications</CardTitle>
                  <CardDescription>
                    Projects you've applied to join
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {applications.length === 0 ? (
                    <div className="text-center py-6">
                      <h3 className="text-lg font-medium mb-2">No applications yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Browse projects and apply to start collaborating
                      </p>
                      <Button asChild>
                        <Link to="/projects">
                          Browse Projects
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((application) => (
                        <div key={application.id} className="flex justify-between items-center border rounded-lg p-4">
                          <div>
                            <div className="font-medium mb-1">{application.project.title}</div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(application.status)}>
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Applied on {formatDate(application.created_at)}
                              </span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/projects/${application.project_id}`}>
                              View Project
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: "70%" }}></div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your profile is 70% complete. Add more details to increase your chances of finding collaborators.
                    </p>
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/profile">Complete Your Profile</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/projects" className="flex items-center">
                      <Rocket className="mr-2 h-4 w-4" />
                      Browse Projects
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/discover" className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      Find Collaborators
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/resources" className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Learning Resources
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Projects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=project1" />
                      <AvatarFallback>RP</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">React Portfolio Builder</div>
                      <div className="text-sm text-muted-foreground">Looking for UI/UX Designer</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=project2" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">AI Content Generator</div>
                      <div className="text-sm text-muted-foreground">Needs Backend Developer</div>
                    </div>
                  </div>
                  <Button variant="ghost" asChild className="w-full">
                    <Link to="/projects" className="flex items-center justify-center">
                      View More Projects
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
