
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Applicant {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

export interface ProjectApplication {
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

export function useProjectNotifications(userId: string) {
  const [applications, setApplications] = useState<ProjectApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchApplications = async () => {
      if (!userId) {
        console.log("No user ID provided for project notifications");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      console.log("Fetching applications for user ID:", userId);
      
      try {
        // Get all projects created by this user
        const { data: projects, error: projectsError } = await supabase
          .from("projects")
          .select("id, title")
          .eq("creator_id", userId);

        if (projectsError) {
          console.error("Error fetching user projects:", projectsError);
          throw projectsError;
        }

        console.log(`Found ${projects?.length || 0} projects for this user`);

        if (projects && projects.length > 0) {
          const projectIds = projects.map((project) => project.id);
          console.log("Project IDs to check for applications:", projectIds);

          // Get applications for all user's projects with status "pending"
          // Important: We're now joining the data in a different way
          const { data: appData, error } = await supabase
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
            .eq("status", "pending");

          if (error) {
            console.error("Error fetching project applications:", error);
            throw error;
          }

          console.log(`Found ${appData?.length || 0} pending applications`);
          
          if (appData && appData.length > 0) {
            // Now we need to fetch project titles and applicant details separately
            const enhancedApplications: ProjectApplication[] = [];
            
            for (const app of appData) {
              // Get the project title
              const { data: projectData } = await supabase
                .from("projects")
                .select("title")
                .eq("id", app.project_id)
                .single();
                
              // Get the applicant details
              const { data: applicantData } = await supabase
                .from("profile_details")
                .select("id, first_name, last_name")
                .eq("id", app.applicant_id)
                .single();
                
              enhancedApplications.push({
                ...app,
                project: {
                  title: projectData?.title || "Unknown Project"
                },
                applicant: {
                  id: app.applicant_id,
                  first_name: applicantData?.first_name || null,
                  last_name: applicantData?.last_name || null
                }
              });
            }
            
            setApplications(enhancedApplications);
          } else {
            console.log("No pending applications found");
            setApplications([]);
          }
        } else {
          console.log("User has no projects");
          setApplications([]);
        }
      } catch (error) {
        console.error("Failed to load project notifications:", error);
        toast({
          title: "Error",
          description: "Failed to load application notifications. Please try refreshing the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
    
    // Set up real-time listener for new applications
    const channel = supabase
      .channel('project_applications_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'project_applications',
        },
        (payload) => {
          console.log('New application received:', payload);
          fetchApplications(); // Refresh the applications when a new one comes in
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, toast]);

  const updateApplicationStatus = async (
    applicationId: string,
    status: string
  ) => {
    console.log(`Updating application ${applicationId} to status: ${status}`);
    
    try {
      const { error } = await supabase
        .from("project_applications")
        .update({ status })
        .eq("id", applicationId);

      if (error) {
        console.error("Error updating application status:", error);
        throw error;
      }

      // Remove the application from the list after update
      setApplications((prev) =>
        prev.filter((application) => application.id !== applicationId)
      );

      toast({
        title: status === "accepted" ? "Application Accepted" : "Application Rejected",
        description:
          status === "accepted"
            ? "The applicant has been notified of your decision"
            : "The applicant will be notified of your decision",
      });
    } catch (error) {
      console.error("Failed to update application status:", error);
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { applications, isLoading, updateApplicationStatus };
}
