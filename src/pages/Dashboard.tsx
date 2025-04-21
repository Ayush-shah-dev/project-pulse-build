
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Plus, Search, User, FileEdit, UserCircle, Star, Calendar, Bell, Loader2 } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  stage: string;
  tags: string[];
  roles_needed: string[];
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [profileCompletionPercentage, setProfileCompletionPercentage] = useState(0);
  const [profileLoading, setProfileLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  // Fetch profile data and calculate completion percentage
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;

      try {
        setProfileLoading(true);
        const { data, error } = await supabase
          .from('profile_details')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
        }

        setProfileData(data);
        
        // Calculate profile completion percentage
        if (data) {
          const fieldsToCheck = [
            'first_name', 'last_name', 'title', 'bio', 
            'location', 'experience', 'industry', 'education'
          ];
          
          const filledFields = fieldsToCheck.filter(field => 
            data[field] && data[field].trim().length > 0
          );
          
          const skillsComplete = data.skills && data.skills.length > 0 ? 1 : 0;
          const linksComplete = 
            (data.github_url && data.github_url.trim().length > 0) || 
            (data.linkedin_url && data.linkedin_url.trim().length > 0) ? 1 : 0;
          
          const totalFieldsToComplete = fieldsToCheck.length + 2; // +2 for skills and links
          const completedFields = filledFields.length + skillsComplete + linksComplete;
          
          const percentage = Math.round((completedFields / totalFieldsToComplete) * 100);
          setProfileCompletionPercentage(percentage);
        }
      } catch (error) {
        console.error('Error in profile data fetch:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  // Fetch user's projects
  useEffect(() => {
    const fetchUserProjects = async () => {
      if (!user) return;

      try {
        setProjectsLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('creator_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching projects:', error);
          return;
        }

        setProjects(data || []);
      } catch (error) {
        console.error('Error in projects fetch:', error);
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchUserProjects();
  }, [user]);

  const isProfileComplete = () => {
    return profileCompletionPercentage < 70;
  };

  if (isLoading || profileLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user?.user_metadata?.first_name || profileData?.first_name || 'User'}!</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your projects and find collaborators</p>
        </header>

        {isProfileComplete() && (
          <Card className="mb-8 border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700">
            <CardContent className="flex items-start gap-4 p-6">
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800 dark:text-yellow-400">Complete your profile</h3>
                <p className="text-yellow-700 dark:text-yellow-500 text-sm mt-1">
                  Your profile is {profileCompletionPercentage}% complete. Add more information to help others find you 
                  and increase your chances of finding collaborators.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 border-yellow-300 hover:bg-yellow-100 dark:border-yellow-700 dark:hover:bg-yellow-900/40"
                  onClick={() => navigate("/profile")}
                >
                  <UserCircle className="h-4 w-4 mr-2" />
                  Complete Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">My Projects</TabsTrigger>
            <TabsTrigger value="collaborations">My Collaborations</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>My Projects</CardTitle>
                  <CardDescription>Projects you've created</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{projects.length}</p>
                  <div className="mt-4">
                    <Button size="sm" onClick={() => navigate("/projects/create")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Project
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Collaborations</CardTitle>
                  <CardDescription>Projects you're part of</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">0</p>
                  <div className="mt-4">
                    <Button size="sm" variant="outline" onClick={() => navigate("/projects")}>
                      <Search className="h-4 w-4 mr-2" />
                      Find Projects
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profile Completion</CardTitle>
                  <CardDescription>Complete your profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Profile</span>
                      <span className="text-sm">{profileCompletionPercentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div 
                        className="h-2 bg-primary rounded-full" 
                        style={{ width: `${profileCompletionPercentage}%` }}
                      ></div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => navigate("/profile")}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Complete Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {projects.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Recent Projects</CardTitle>
                  <CardDescription>Projects you've recently created</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.slice(0, 2).map(project => (
                      <div key={project.id} className="p-4 border rounded-md">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{project.title}</h3>
                          <Badge className={getStageColor(project.stage)}>
                            {project.stage.charAt(0).toUpperCase() + project.stage.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            Created {formatDate(project.created_at)}
                          </span>
                          <Button size="sm" variant="outline" onClick={() => navigate(`/projects/${project.id}`)}>
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                {projects.length > 2 && (
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => navigate("/projects")}>
                      View All Projects
                    </Button>
                  </CardFooter>
                )}
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent actions and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-3 bg-muted/40 rounded-md">
                    <Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Welcome to CollabHub!</p>
                      <p className="text-sm text-muted-foreground">
                        Complete your profile to get started finding collaborators
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Just now</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-3 bg-muted/40 rounded-md">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Account created</p>
                      <p className="text-sm text-muted-foreground">
                        Your account was successfully created
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Today</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recommended Projects</CardTitle>
                <CardDescription>Based on your profile and interests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">EcoTrack - Environmental Monitoring Platform</h3>
                      <Badge>Prototype</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      A platform for tracking and visualizing environmental data from DIY sensors.
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">92% match</span>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => navigate("/projects")}>
                        View Details
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">Linguify - AI Language Learning Assistant</h3>
                      <Badge>MVP</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      An AI-powered language learning platform with personalized learning paths.
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">85% match</span>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => navigate("/projects")}>
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => navigate("/projects")}>
                  <Search className="h-4 w-4 mr-2" />
                  Browse All Projects
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>My Projects</CardTitle>
                    <CardDescription>Projects you've created</CardDescription>
                  </div>
                  <Button onClick={() => navigate("/projects/create")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Project
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {projectsLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                    <p>Loading your projects...</p>
                  </div>
                ) : projects.length > 0 ? (
                  <div className="grid gap-4">
                    {projects.map(project => (
                      <div key={project.id} className="p-4 border rounded-md">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{project.title}</h3>
                          <Badge className={getStageColor(project.stage)}>
                            {project.stage.charAt(0).toUpperCase() + project.stage.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.tags && project.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            Created {formatDate(project.created_at)}
                          </span>
                          <Button size="sm" onClick={() => navigate(`/projects/${project.id}`)}>
                            View Project
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileEdit className="h-16 w-16 mx-auto text-muted-foreground opacity-20 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No projects yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Share your ideas and find collaborators by creating your first project.
                      Get started by clicking the "Create New Project" button.
                    </p>
                    <Button onClick={() => navigate("/projects/create")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Project
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collaborations">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>My Collaborations</CardTitle>
                    <CardDescription>Projects you're collaborating on</CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => navigate("/projects")}>
                    <Search className="h-4 w-4 mr-2" />
                    Find Projects
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <User className="h-16 w-16 mx-auto text-muted-foreground opacity-20 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No collaborations yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Join exciting projects that match your skills and interests.
                    Browse available projects to start collaborating.
                  </p>
                  <Button onClick={() => navigate("/projects")}>
                    <Search className="h-4 w-4 mr-2" />
                    Discover Projects
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Recent updates and activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-3 bg-muted/40 rounded-md">
                    <Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Welcome to CollabHub!</p>
                      <p className="text-sm text-muted-foreground">
                        Complete your profile to get started finding collaborators
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Just now</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-3 bg-muted/40 rounded-md">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Account created</p>
                      <p className="text-sm text-muted-foreground">
                        Your account was successfully created
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Today</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
