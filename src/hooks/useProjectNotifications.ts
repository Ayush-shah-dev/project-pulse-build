
import { useState, useEffect, useCallback } from "react";
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

  // Define fetchApplications as a useCallback to allow it to be called from outside
  const fetchApplications = useCallback(async () => {
    if (!userId) {
      console.log("No user ID provided for project notifications");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    console.log("Fetching applications for user ID:", userId);
    
    try {
      // First, get all projects CREATED by this user (not applied to)
      const { data: userProjects, error: projectsError } = await supabase
        .from("projects")
        .select("id, title")
        .eq("creator_id", userId);

      if (projectsError) {
        console.error("Error fetching user created projects:", projectsError);
        throw projectsError;
      }

      console.log(`Found ${userProjects?.length || 0} projects created by this user:`, userProjects);

      if (!userProjects || userProjects.length === 0) {
        console.log("User has not created any projects");
        setApplications([]);
        setIsLoading(false);
        return;
      }

      // Get project IDs that the user has created
      const projectIds = userProjects.map(project => project.id);
      console.log("Project IDs to check for applications:", projectIds);

      // Get pending applications for projects that this user CREATED
      const { data: pendingApplications, error: applicationsError } = await supabase
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

      if (applicationsError) {
        console.error("Error fetching pending applications:", applicationsError);
        throw applicationsError;
      }

      console.log(`Found ${pendingApplications?.length || 0} pending applications:`, pendingApplications);
      
      if (!pendingApplications || pendingApplications.length === 0) {
        setApplications([]);
        setIsLoading(false);
        return;
      }

      // Create a map of project IDs to project titles for efficient lookup
      const projectTitlesMap = Object.fromEntries(
        userProjects.map(project => [project.id, project.title])
      );
      
      // Process applications and fetch applicant details
      const enhancedApplications = await Promise.all(
        pendingApplications.map(async (app) => {
          try {
            // Get applicant profile details
            const { data: profileData, error: profileError } = await supabase
              .from("profile_details")
              .select("first_name, last_name")
              .eq("id", app.applicant_id)
              .maybeSingle();
              
            if (profileError) {
              console.error(`Error fetching profile for ${app.applicant_id}:`, profileError);
            }
            
            return {
              ...app,
              project: {
                title: projectTitlesMap[app.project_id] || "Unknown Project"
              },
              applicant: {
                id: app.applicant_id,
                first_name: profileData?.first_name || null,
                last_name: profileData?.last_name || null
              }
            };
          } catch (error) {
            console.error(`Error processing application ${app.id}:`, error);
            // Return a valid application object even if there's an error
            return {
              ...app,
              project: {
                title: projectTitlesMap[app.project_id] || "Unknown Project"
              },
              applicant: {
                id: app.applicant_id,
                first_name: null,
                last_name: null
              }
            };
          }
        })
      );
      
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
  }, [userId, toast]);

  // Export the fetchApplications function as refetchApplications
  const refetchApplications = fetchApplications;

  useEffect(() => {
    // Initial fetch
    fetchApplications();
    
    // Set up real-time listener for changes in project_applications table
    const channel = supabase
      .channel('project_applications_changes')
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
      .subscribe();
      
    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [userId, fetchApplications]);

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

      return true;
    } catch (error) {
      console.error("Failed to update application status:", error);
      throw error;
    }
  };

  return { applications, isLoading, updateApplicationStatus, refetchApplications };
}
