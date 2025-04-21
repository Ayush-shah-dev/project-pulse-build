
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Applicant {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

interface ProjectApplication {
  id: string;
  project_id: string;
  applicant_id: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
  project: {
    title: string;
  };
  applicant: Applicant;
}

interface ProjectNotificationsProps {
  userId: string;
}

const ProjectNotifications = ({ userId }: ProjectNotificationsProps) => {
  const [applications, setApplications] = useState<ProjectApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        // Fetch applications for projects where the current user is the creator
        const { data: projects, error: projectsError } = await supabase
          .from("projects")
          .select("id")
          .eq("creator_id", userId);

        if (projectsError) throw projectsError;
        
        if (projects && projects.length > 0) {
          const projectIds = projects.map(project => project.id);
          
          // Using explicit join syntax instead of nested select
          const { data, error } = await supabase
            .from("project_applications")
            .select(`
              id, 
              project_id, 
              applicant_id, 
              message, 
              status, 
              created_at,
              updated_at
            `)
            .in("project_id", projectIds)
            .eq("status", "pending")
            .order("created_at", { ascending: false });

          if (error) throw error;
          
          // If we have applications, fetch the related data separately
          if (data && data.length > 0) {
            // Create an array to hold the complete application data
            const completeApplications: ProjectApplication[] = [];
            
            // Process each application
            for (const app of data) {
              // Fetch project info
              const { data: projectData, error: projectError } = await supabase
                .from("projects")
                .select("title")
                .eq("id", app.project_id)
                .single();
                
              if (projectError) {
                console.error("Error fetching project:", projectError);
                continue;
              }
              
              // Fetch applicant info
              const { data: applicantData, error: applicantError } = await supabase
                .from("profile_details")
                .select("id, first_name, last_name")
                .eq("id", app.applicant_id)
                .single();
                
              if (applicantError) {
                console.error("Error fetching applicant:", applicantError);
                continue;
              }
              
              // Add to complete applications
              completeApplications.push({
                ...app,
                project: { title: projectData.title },
                applicant: applicantData
              });
            }
            
            setApplications(completeApplications);
          } else {
            setApplications([]);
          }
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast({
          title: "Error",
          description: "Failed to load application notifications",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchApplications();
    }
  }, [userId, toast]);

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("project_applications")
        .update({ status })
        .eq("id", applicationId);

      if (error) throw error;

      setApplications(prev => 
        prev.filter(application => application.id !== applicationId)
      );

      toast({
        title: status === "accepted" ? "Application Accepted" : "Application Rejected",
        description: status === "accepted" 
          ? "The applicant has been notified of your decision" 
          : "The applicant will be notified of your decision",
      });
    } catch (error) {
      console.error("Error updating application:", error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Project Applications
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (applications.length === 0) {
    return null; // Don't show the card if there are no applications
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          Project Applications
          {applications.length > 0 && (
            <Badge className="ml-2 bg-primary">{applications.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {applications.map(application => {
          const applicantName = `${application.applicant.first_name || ''} ${application.applicant.last_name || ''}`.trim() || 'Anonymous User';
          
          return (
            <div key={application.id} className="border-b pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${application.applicant.id}`} 
                      alt={applicantName} 
                    />
                    <AvatarFallback>{applicantName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{applicantName}</div>
                    <div className="text-sm text-muted-foreground">
                      Applied to <Link to={`/projects/${application.project_id}`} className="font-medium hover:underline">{application.project.title}</Link>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 w-8 p-0 text-green-600" 
                    onClick={() => updateApplicationStatus(application.id, "accepted")}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 w-8 p-0 text-red-600" 
                    onClick={() => updateApplicationStatus(application.id, "rejected")}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="bg-muted/50 rounded-md p-3 text-sm whitespace-pre-line">
                {application.message}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ProjectNotifications;
