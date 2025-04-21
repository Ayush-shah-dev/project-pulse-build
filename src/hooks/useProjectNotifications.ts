
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
      const { data: userProjects, error: projectsError } = await supabase
        .from("projects")
        .select("id, title")
        .eq("creator_id", userId);

      if (projectsError) {
        console.error("Error fetching user projects:", projectsError);
        throw projectsError;
      }

      console.log(`Found ${userProjects?.length || 0} projects for this user:`, userProjects);

      if (!userProjects || userProjects.length === 0) {
        console.log("User has no projects");
        setApplications([]);
        setIsLoading(false);
        return;
      }

      // Get project IDs
      const projectIds = userProjects.map(project => project.id);
      console.log("Project IDs to check for applications:", projectIds);

      // Get applications for all user's projects with status "pending"
      const { data: pendingApplications, error: applicationsError } = await supabase
        .from("project_applications")
        .select("*")
        .in("project_id", projectIds)
        .eq("status", "pending");

      if (applicationsError) {
        console.error("Error fetching project applications:", applicationsError);
        throw applicationsError;
      }

      console.log(`Found ${pendingApplications?.length || 0} pending applications:`, pendingApplications);
      
      if (!pendingApplications || pendingApplications.length === 0) {
        setApplications([]);
        setIsLoading(false);
        return;
      }

      // Create a map of project IDs to project titles for efficient lookup
      const projectMap = Object.fromEntries(
        userProjects.map(project => [project.id, project.title])
      );
      
      // Process applications and fetch applicant details
      const enhancedApplications: ProjectApplication[] = [];
      
      for (const app of pendingApplications) {
        try {
          // Get applicant details
          const { data: applicantData, error: applicantError } = await supabase
            .from("profile_details")
            .select("id, first_name, last_name")
            .eq("id", app.applicant_id)
            .maybeSingle(); // Using maybeSingle instead of single to handle cases where profile doesn't exist
            
          if (applicantError) {
            console.error(`Error fetching applicant details for ${app.applicant_id}:`, applicantError);
            // Continue processing other applications even if we can't get this one's applicant details
            continue;
          }
          
          // Create a valid application object with default values for missing profile information
          enhancedApplications.push({
            ...app,
            project: {
              title: projectMap[app.project_id] || "Unknown Project"
            },
            applicant: {
              id: app.applicant_id,
              first_name: applicantData?.first_name || "Anonymous",
              last_name: applicantData?.last_name || "User"
            }
          });
        } catch (error) {
          console.error(`Error processing application ${app.id}:`, error);
        }
      }
      
      console.log("Enhanced applications:", enhancedApplications);
      setApplications(enhancedApplications);
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

  useEffect(() => {
    // Initial fetch
    fetchApplications();
    
    // Set up real-time listener for changes in project_applications table
    const channel = supabase
      .channel('project_applications_channel')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'project_applications',
        },
        (payload) => {
          console.log('Project application change detected:', payload);
          // Refresh the applications when any change occurs
          fetchApplications();
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });
      
    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const updateApplicationStatus = async (
    applicationId: string,
    status: string
  ) => {
    console.log(`Updating application ${applicationId} to status: ${status}`);
    
    try {
      const { error } = await supabase
        .from("project_applications")
        .update({ status, updated_at: new Date().toISOString() })
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
