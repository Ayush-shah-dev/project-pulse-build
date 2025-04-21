
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Link as LinkIcon, Loader2, Users } from "lucide-react";
import ProjectApplicationModal from "@/components/project/ProjectApplicationModal";
import { useAuth } from "@/contexts/AuthContext";

interface ProjectMember {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  stage: string;
  roles_needed: string[];
  category: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  // Extended properties for UI
  members?: ProjectMember[];
}

const ProjectView = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        
        if (!id) return;
        
        const { data: projectData, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (projectData) {
          const { data: profileData } = await supabase
            .from('profile_details')
            .select('first_name, last_name, id')
            .eq('id', projectData.creator_id)
            .single();

          const projectWithDetails = {
            ...projectData,
            members: profileData ? [{
              id: profileData.id,
              name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Anonymous User',
              avatar: `https://randomuser.me/api/portraits//${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
              role: 'Project Owner'
            }] : [],
          };

          setProject(projectWithDetails);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        toast({
          title: 'Error',
          description: 'Failed to load project details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, toast]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
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

  const handleApply = async (answers: { why: string; experience: string; }) => {
    if (!project || !user) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("project_applications").insert({
        project_id: project.id,
        applicant_id: user.id,
        message: `Why: ${answers.why}\nExperience: ${answers.experience}`,
        status: "pending"
      });
      
      if (error) throw error;
      
      toast({
        title: "Application Submitted",
        description: "Your application has been sent to the project owner.",
        variant: "default",
      });
      setShowModal(false);
    } catch (err) {
      toast({
        title: "Failed to Submit",
        description: "There was an error submitting your application.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading project details...</span>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
            <p className="mb-6 text-muted-foreground">The project you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/projects">Back to Projects</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/projects" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={getStageColor(project.stage)}>
                  {project.stage.charAt(0).toUpperCase() + project.stage.slice(1)}
                </Badge>
                {project.category && (
                  <Badge variant="outline">{project.category}</Badge>
                )}
                <span className="text-sm text-muted-foreground">
                  <Calendar className="inline h-3 w-3 mr-1" />
                  Created {formatDate(project.created_at)}
                </span>
              </div>
            </div>
            <Button onClick={() => setShowModal(true)} className="flex items-center gap-2" disabled={!user}>
              <Users className="h-4 w-4" />
              Apply to Project
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Project</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line">{project.description}</p>
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-2">Skills & Technologies</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Roles Needed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.roles_needed.length > 0 ? (
                        project.roles_needed.map(role => (
                          <Badge 
                            key={role} 
                            variant="outline" 
                            className="bg-brand-purple/5 border-brand-purple/20 text-brand-purple px-3 py-1"
                          >
                            {role}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No specific roles listed</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="discussions">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-center items-center p-12 text-center">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Discussions Coming Soon</h3>
                        <p className="text-muted-foreground mb-4">
                          This feature is currently being developed. Check back later!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="tasks">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-center items-center p-12 text-center">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Task Management Coming Soon</h3>
                        <p className="text-muted-foreground mb-4">
                          Project tasks and management tools will be available soon!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Project Team</CardTitle>
              </CardHeader>
              <CardContent>
                {project.members && project.members.length > 0 ? (
                  <div className="space-y-4">
                    {project.members.map(member => (
                      <div key={member.id} className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          {member.role && <div className="text-sm text-muted-foreground">{member.role}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No team members yet</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="#" className="flex items-center">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Project Website
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="#" className="flex items-center">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    GitHub Repository
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <ProjectApplicationModal
          open={showModal}
          onOpenChange={setShowModal}
          onSubmit={handleApply}
          loading={isSubmitting}
        />
      </div>
    </Layout>
  );
};

export default ProjectView;
