
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Plus, Search, User, FileEdit, UserCircle, Star, Calendar, Bell } from "lucide-react";

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  const isProfileComplete = () => {
    // In a real app, this would check if all required profile fields are filled
    return false; // Simulate incomplete profile
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <p className="text-center">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user?.user_metadata?.first_name || 'User'}!</h1>
          <p className="text-gray-600">Manage your projects and find collaborators</p>
        </header>

        {!isProfileComplete() && (
          <Card className="mb-8 border-yellow-300 bg-yellow-50">
            <CardContent className="flex items-start gap-4 p-6">
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800">Complete your profile</h3>
                <p className="text-yellow-700 text-sm mt-1">
                  Your profile is incomplete. Add more information to help others find you 
                  and increase your chances of finding collaborators.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 border-yellow-300 hover:bg-yellow-100"
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
                  <p className="text-3xl font-bold">0</p>
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
                      <span className="text-sm">30%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-primary rounded-full w-[30%]"></div>
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
